'use strict';
var crypto = require('crypto');
var dejavu = require('dejavu');
var xml2js = require('xml2js');
var DatabaseApiInterface = require('../../interfaces/DatabaseApiInterface');
var SalsaManager = require('../common/SalsaManager');
var UuidManager = require('../common/UuidManager')

var MetaObject = require('./objects/MetaObject');
var GroupObject = require('./objects/GroupObject');
var GroupApi = require('./apis/GroupApi');

var Kdb4Api = dejavu.Class.declare({
    $name: 'Kdb4Api',
    $implements: [DatabaseApiInterface],
    $statics: {
        SALSA_IV: [0xE8, 0x30, 0x09, 0x4B, 0x97, 0x20, 0x5D, 0x2A]
    },
    
    _parser: new xml2js.Parser({ explicitArray: false }),
    _builder: new xml2js.Builder({ explicitArray: false }),
    __salsaManager: null,
    __uuidManager: null,
    
    __rawDatabase: null,
    __header: null,
    __database: null,
    __metaData: null,
    __groups: {},
    
    /**
     * Returns the version of the API. The API has always
     * the same version as the database, in this case (KDB)4.
     * 
     * @returns {number} The API version
     */
    getApiVersion: function getApiVersion() { return 4; },
    
    /**
     * Parses a buffer containing the raw database in XML format
     * so it can be accessed with the API later on. Should not
     * be called by the user.
     * 
     * @param {string} Buffer containing the database in XML format
     * @param {function} Callback function with signature: (err)
     */
    parseDatabase: function parseDatabase(databaseBuffer, header, cb) {
        this.__rawDatabase = databaseBuffer;
        this.__header = header;
        
        var salsaKey = this.__header.get('ProtectedStreamKey').toString('binary');
        salsaKey = crypto.createHash('sha256').update(salsaKey, 'binary', 'binary');
        salsaKey = Array.prototype.slice.call(new Buffer(salsaKey.digest('binary'), 'binary'), 0);
        this.__salsaManager = new SalsaManager(salsaKey, this.$static.SALSA_IV);
        
        this.__uuidManager = new UuidManager();
        this._parser.parseString(this.__rawDatabase.toString(), function(err, result) {
            if(err) return cb(err);
            
            if(!result.KeePassFile) {
                return cb(new Error('Invalid KeePass database - XML root node "KeePassFile" is missing.'));
            } else {
                this.__database = result.KeePassFile;
                this.__metaData = new MetaObject(this.__database.Meta);
                this.__groups = {};
                
                var dbRoot = this.__database.Root;
                this.__parseGroups(dbRoot);
                this.__parseDeletedObjects(dbRoot);
                
                return cb(null);    
            }
        }.$bind(this));
    },
    
    __parseGroups: function parseGroups(dbRoot) {
        for(var key in dbRoot) {
            switch(key.toLowerCase()) {
                case 'group':
                    this.__uuidManager.markUsed(dbRoot[key].UUID);
                    this.__groups[dbRoot[key].UUID] = new GroupApi(new GroupObject(dbRoot[key], this));
                    break;
            }
        }
    },
    
    __parseDeletedObjects: function __parseDeletedObjects(dbRoot) {
        if(!dbRoot.DeletedObjects) return;
        if(!dbRoot.DeletedObjects.DeletedObject) return;
        var deletedObjects = Array.isArray(dbRoot.DeletedObjects.DeletedObject)
            ? dbRoot.DeletedObjects.DeletedObject
            : [dbRoot.DeletedObjects.DeletedObject];
        
        for(var key in deletedObjects)
            this.__uuidManager.markDeleted(deletedObjects[key].UUID);
    },
    
    /**
     * Returns the raw database without any modifications.
     * Remember that Salsa20 protected passwors won't be
     * decrypted too.
     * 
     * @returns {string} The database in XML format
     */
    getRawDatabase: function getRawDatabase() {
        return this.__rawDatabase.toString();
    },
    
    getSalsaManager: function getSalsaManager() {
        return this.__salsaManager;
    },
    
    getUuidManager: function getUuidManager() {
        return this.__uuidManager;
    },
    
    /**
     * Provides access to the MetaObject instance, based on the DataObjectInterface
     * 
     * meta()                   => Returns all meta data
     * meta('hello')            => Returns the meta data value of 'hello'
     * meta('hello', 'world')   => Sets the meta data value of 'hello' to 'world'
     * meta({ a: 1, b: 2 })     => Same as the method above, but provides the ability to modify multiple values at once
     */
    meta: function meta() {
        var args = Array.prototype.slice.apply(arguments);
        args.unshift(this);
        return this.__metaData.handleMetaCall.apply(this.__metaData, args);
    },
    
    /**
     * If the parameter uuid was not specified, a list of all groups will
     * be returned. The list always has the group UUID as the key and the
     * group api instance as its value.
     * 
     * If a uuid was specified, it will try to find a group with the given uuid
     * and return it. If it was not found, an error will be thrown.
     */
    groups: function groups(uuid) {
        if(uuid === undefined) {
            return this.__groups;
        } else {
            if(this.__groups[uuid]) {
                return this.__groups[uuid];
            } else {
                throw new Error('There is no group with the following UUID: ' + uuid);
            }
        }
    }
});

module.exports = Kdb4Api;