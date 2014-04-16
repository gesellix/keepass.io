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
            0xB54BFB67: require('../versions/kdb4/Kdb4Database')
        }
    },
    
    __isLoaded: false,
    __database: null,
    __databasePath: null,
    __compositeHash: null,
    
    loadFile: function loadFile(fileName, eventEmitter, compositeHash) {
        this.__databasePath = fileName;
        this.__compositeHash = compositeHash;
        
        async.waterfall([
            this.__readFileIntoMemory,
            this.__checkSignatures,
            this.__dispatchToVersionHandler
        ], function(err) {
            // Send result back to application / caller
            if(err) {
                eventEmitter.emit('error', err);
            } else {
                eventEmitter.emit('ready');
            }
        }.$bind(this));
    },
    
    getApi: function getApi() {
        return this.__database.getApi();
    },
    
    isLoaded: function isLoaded() {
        return this.__isLoaded;
    },
    
    __readFileIntoMemory: function __readFileIntoMemory(cb) {
        fs.readFile(this.__databasePath, function(err, buffer) {
            if(err) return cb(new Error('Could not open database file: ' + err.toString()));
            return cb(null, buffer);
        });
    }.$bound(),
    
    __checkSignatures: function __checkSignatures(fileBuffer, cb) {
        var foundSignatures = Helpers.readDatabaseSignatures(fileBuffer);
        
        // Compare base signature
        if(foundSignatures[0] !== this.$static.BASE_SIGNATURE) {
            return cb(new Error('The specified database file contains an invalid base signature.'));
        }
        
        // Check version signature against supported versions
        if(!this.$static.VERSION_SIGNATURES.hasOwnProperty(foundSignatures[1])) {
            return cb(new Error('Sorry, the version of your database file is not yet supported.'));
        }
        
        return cb(null, fileBuffer, foundSignatures[1]);
    }.$bound(),
    
    __dispatchToVersionHandler: function __dispatchToVersionHandler(fileBuffer, versionSignature, cb) {
        this.__database = new (this.$static.VERSION_SIGNATURES[versionSignature])(fileBuffer, this.__compositeHash);
        this.__database.load(function(err) {
            this.__isLoaded = true;
            return cb(err);
        }.$bind(this));
    }.$bound()
});

module.exports = DatabaseManager;