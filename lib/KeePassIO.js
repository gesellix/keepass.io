'use strict';
var crypto = require('crypto');
var events = require('events');
var dejavu = require('dejavu');
var SecureBuffer = require('./common/SecureBuffer');
var CredentialInterface = require('./interfaces/CredentialInterface');
var DatabaseManager = require('./common/DatabaseManager');

var KeePassIO = dejavu.Class.declare({
    $name: 'KeePassIO',
    
    __credentials: [],
    __eventEmitter: null,
    __databaseManager: null,
    
    initialize: function initialize() {
        this.__eventEmitter = new events.EventEmitter();
        this.__databaseManager = new DatabaseManager();
    },
    
    addCredential: function addCredential(credential) {
        if(dejavu.instanceOf(credential, CredentialInterface)) {
            this.__credentials.push(credential);
        } else {
            throw new Error('The credential provider must implement "CredentialInterface".');
        }
    },
    
    dropAllCredentials: function dropAllCredentials() {
        this.__credentials.forEach(function(credential) {
            credential.drop();
        });
    },
    
    loadDatabase: function loadDatabase(fileName) {
        if(!this.__databaseManager.isLoaded()) {
            this.__buildCompositeHash(function(compositeHash) {
                this.__databaseManager.loadFile(fileName, this.__eventEmitter, compositeHash); 
            }.$bind(this));
        } else {
            throw new Error('Only one database can be loaded per kpio instance.');
        }
        return this.__eventEmitter;
    },
    
    getApi: function getApi() {
        if(!this.__databaseManager.isLoaded()) {
            throw new Error('No database was loaded before.');
        } else {
            return this.__databaseManager.getApi();
        }
    },
    
    __buildCompositeHash: function __buildCompositeHash(cb) {
        // Sort added credentials based on their priority
        this.__credentials = this.__credentials.sort(function(a, b) {
            if(a.getPriority() > b.getPriority()) {
                return -1;
            } else if(a.getPriority() < b.getPriority()) {
                return 1;
            } else {
                return 0;
            }
        });
        
        // Merge all credentials together
        var compositeHash = crypto.createHash('sha256');
        this.__credentials.forEach(function(credential) {
            compositeHash.update(credential.getFinalKey().toString('binary'), 'binary');
        });
        compositeHash = new SecureBuffer(compositeHash.digest('binary'), 'binary');
        
        return cb(compositeHash);
    }
});

module.exports = KeePassIO;