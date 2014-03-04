'use strict';
var async = require('async');
var dejavu = require('dejavu');
var crypto = require('crypto');
var SecureBuffer = require('../../common/SecureBuffer');
var DatabaseInterface = require('../../interfaces/DatabaseInterface');
var Helpers = (require('../../common/Helpers')).$static.getInstance();
var Kdb4Header = require('./Kdb4Header');

var Kdb4Database = dejavu.Class.declare({
    $name: 'Kdb4Database',
    $implements: [DatabaseInterface],
    
    __fileBuffer: null,
    __header: null,
    __headerLength: null,
    __compositeHash: null,
    __masterKey: null,
    
    initialize: function initialize(fileBuffer, compositeHash) {
        this.__fileBuffer = fileBuffer;
        this.__compositeHash = compositeHash;
        
        this.__header = new Kdb4Header({
            fields: {
                'EndOfHeader': 0,
                'Comment': 1,
                'CipherID': 2,
                'CompressionFlags': 3,
                'MasterSeed': 4,
                'TransformSeed': 5,
                'TransformRounds': 6,
                'EncryptionIV': 7,
                'ProtectedStreamKey': 8,
                'StreamStartBytes': 9,
                'InnerRandomStreamID': 10
            },
            formats: {
                3: '<I',
                6: '<q'
            }
        });
    },
    
    parse: function parse(cb) {
        async.waterfall([
            this.__parseKdbHeader,
            this.__buildMasterKey
        ], function(err) {
            return cb(err); 
        }.$bind(this));
    },
    
    __parseKdbHeader: function __parseKdbHeader(cb) {
        var currentOffset = 12;
        var fieldID, fieldLength, fieldData;
        
        while(true) {
            // Get header field ID
            fieldID = Helpers.readBuffer(this.__fileBuffer, currentOffset, 1, 'b');
            currentOffset += 1;
            
            // Check if field ID is correct and exists
            if(!this.__header.hasField(fieldID)) {
                return cb(new Error('Invalid header field ID. Maybe the database file is corrupted?'));   
            }
            
            // Get header field length
            fieldLength = Helpers.readBuffer(this.__fileBuffer, currentOffset, 2, 'h');
            currentOffset += 2;
            
            // Read field if length is greater than zero
            if(fieldLength > 0) {
                fieldData = Helpers.readBuffer(this.__fileBuffer, currentOffset, fieldLength, fieldLength + 'A');
                currentOffset += fieldLength;
                this.__header.set(fieldID, fieldData);
            }
            
            // Abort if field ID equals zero, which represents the 'EndOfHeader' field
            if(fieldID === 0) {
                this.__headerLength = currentOffset;
                break;
            }
        }
        
        return cb(null);
    }.$bound(),
    
    __buildMasterKey: function __buildMasterKey(cb) {
        // Transform composite hash n times
        var transformedKey = Helpers.transformKey(
            this.__compositeHash.toString('binary'),
            this.__header.get('TransformSeed'),
            this.__header.get('TransformRounds')
        );
        transformedKey = crypto.createHash('sha256').update(transformedKey, 'binary').digest('binary');
        
        // Drop composite hash buffer
        this.__compositeHash.drop();
        
        // Build master key
        var masterKey = this.__header.get('MasterSeed').toString('binary') + transformedKey;
        masterKey = crypto.createHash('sha256').update(masterKey, 'binary').digest('binary');
        
        // Store master key as safe as possible...
        if(this.__masterKey) this.__masterKey.drop();
        this.__masterKey = new SecureBuffer(masterKey, 'binary');
        
        return cb(null);
    }.$bound()
    
});

module.exports = Kdb4Database;