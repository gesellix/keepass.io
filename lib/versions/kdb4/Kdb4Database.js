'use strict';
var async = require('async');
var dejavu = require('dejavu');
var DatabaseInterface = require('../../interfaces/DatabaseInterface');
var Helpers = (require('../../common/Helpers')).$static.getInstance();
var Kdb4Header = require('./Kdb4Header');

var Kdb4Database = dejavu.Class.declare({
    $name: 'Kdb4Database',
    $implements: [DatabaseInterface],
    
    __fileBuffer: null,
    __header: null,
    __headerLength: null,
    
    initialize: function(fileBuffer) {
        this.__fileBuffer = fileBuffer;
        
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
    
    parse: function(cb) {
        async.waterfall([
            this.__parseKdbHeader
        ], function(err) {
            return cb(err); 
        });
    },
    
    __parseKdbHeader: function(cb) {
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
    }.$bound()
    
});

module.exports = Kdb4Database;