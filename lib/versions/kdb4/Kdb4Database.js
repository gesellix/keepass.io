'use strict';
var async = require('async');
var dejavu = require('dejavu');
var crypto = require('crypto');
var zlib = require('zlib');
var SecureBuffer = require('../../common/SecureBuffer');
var DatabaseInterface = require('../../interfaces/DatabaseInterface');
var HashedBlockIO = require('../common/HashedBlockIO').$static.getInstance();
var Helpers = (require('../../common/Helpers')).$static.getInstance();
var Kdb4Header = require('./Kdb4Header');
var Kdb4Api = require('./Kdb4Api');

var Kdb4Database = dejavu.Class.declare({
    $name: 'Kdb4Database',
    $implements: [DatabaseInterface],
    
    __fileBuffer: null,
    __header: null,
    __headerLength: null,
    __compositeHash: null,
    __masterKey: null,
    __database: null,
    __api: null,
    
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
    
    load: function load(cb) {
        async.waterfall([
            this.__parseKdbHeader,
            this.__buildMasterKey,
            this.__decryptDatabase,
            this.__decompressDatabase,
            this.__initializeApi
        ], function(err) {
            return cb(err); 
        }.$bind(this));
    },
    
    getApi: function getApi() {
        if(!this.__api) {
            throw new Error('Sorry, the API was not initialized yet.');
        }
        return this.__api;
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
    }.$bound(),
    
    __decryptDatabase: function __decryptDatabase(cb) {
        var cipher = crypto.createDecipheriv('aes-256-cbc', this.__masterKey.toString('binary'), this.__header.get('EncryptionIV'))
        var database = this.__fileBuffer.slice(this.__headerLength).toString('binary');
        
        // Decrypt database with AES-256-CBC
        cipher.setAutoPadding(true);
        try {
            database = cipher.update(database, 'binary', 'binary') + cipher.final('binary');
            database = new SecureBuffer(database, 'binary');
            this.__masterKey.drop();
        } catch (err) {
            return cb(new Error('Master key was invalid. Either the database is corrupted or the credentials were invalid.'));
        }
        
        // Check database consistency and extract real data via HBIO algorithm
        var headerStartBytes = this.__header.get('StreamStartBytes').toString('binary');
        var readStartBytes = database.slice(0, headerStartBytes.length);
        if(headerStartBytes === readStartBytes.toString('binary')) {
            // Extract the payload from the decrypted database buffer, which starts
            // after the stream start bytes. Then drop the complete database buffer
            // and the read start bytes buffer for security reasons. Now try to
            // decrypt the payload with HBIO (hashed block I/O), which also checks
            // consistency and last but not least drop the payload.
            //
            // Result: One single "SecureBuffer" which contains the database
            var payload = database.slice(headerStartBytes.length);
            database.drop();
            readStartBytes.drop();
            database = HashedBlockIO.decrypt(payload);
            payload.drop();
        } else {
            return cb(new Error('Stream start bytes were invalid. Either the database is corrupted or the credentials were invalid.'));
        }
        
        this.__database = database;
        return cb(null);
    }.$bound(),
    
    __decompressDatabase: function __decompressDatabase(cb) {
        if(this.__header.get('CompressionFlags') === 1) {
            zlib.gunzip(this.__database.getRaw('ACKNOWLEDGE-DANGER'), function afterDecompression(err, decompressedDatabase) {
                if(err) {
                    console.error(err);
                    return cb(new Error('Could not decompress database, the database might be corrupted.'));    
                }
                
                this.__database.drop();
                this.__database = new SecureBuffer(decompressedDatabase);
                return cb(null);
            }.$bind(this));
        } else {
            return cb(null);   
        }
    }.$bound(),
    
    __initializeApi: function __initializeApi(cb) {
        this.__api = new Kdb4Api();
        this.__api.parseDatabase(this.__database, function(err) {
            return cb(err);
        });
    }.$bound()
    
});

module.exports = Kdb4Database;