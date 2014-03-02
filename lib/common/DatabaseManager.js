'use strict';
var fs = require('fs');
var async = require('async');
var dejavu = require('dejavu');
var Helpers = (require('./Helpers')).$static.getInstance();

var DatabaseManager = dejavu.Class.declare({
    $name: 'DatabaseManager',
    $statics: {
        BASE_SIGNATURE: 0x9AA2D903,
        VERSION_SIGNATURES: {
            0xB54BFB67: null
        }
    },
    
    __isLoaded: false,
    __databasePath: null,
    __compositeHash: null,
    
    loadFile: function(fileName, eventEmitter, compositeHash) {
        this.__databasePath = fileName;
        this.__compositeHash = compositeHash;
        
        async.waterfall([
            this._readFileIntoMemory,
            this._checkSignatures
        ], function(err) {
            // Overwrite composite hash buffer and destroy reference
            this.__compositeHash.fill(0, 0, this.__compositeHash.length);
            this.__compositeHash = null;
            
            // Send result back to application / caller
            if(err) {
                eventEmitter.emit('error', err);
            } else {
                eventEmitter.emit('ready');
            }
        }.$bind(this));
    },
    
    isLoaded: function() {
        return this.__isLoaded;
    },
    
    _readFileIntoMemory: function(cb) {
        fs.readFile(this.__databasePath, function(err, buffer) {
            if(err) return cb(err);
            return cb(null, buffer);
        });
    }.$bound(),
    
    _checkSignatures: function(fileBuffer, cb) {
        var foundSignatures = Helpers.readDatabaseSignatures(fileBuffer);
        
        // Compare base signature
        if(foundSignatures[0] !== this.$static.BASE_SIGNATURE) {
            return cb(new Error('The specified database file contains an invalid base signature.'));
        }
        
        // Check version signature against supported versions
        if(!this.$static.VERSION_SIGNATURES.hasOwnProperty(foundSignatures[1])) {
            return cb(new Error('Sorry, the version of your database file is not yet supported.'));
        }
        
        return cb(null, fileBuffer);
    }.$bound()
});

module.exports = DatabaseManager;