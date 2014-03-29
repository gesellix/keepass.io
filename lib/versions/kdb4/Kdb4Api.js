'use strict';
var dejavu = require('dejavu');
var xml2js = require('xml2js');
var DatabaseApiInterface = require('../../interfaces/DatabaseApiInterface');

var MetaObject = require('./objects/MetaObject');
var GroupObject = require('./objects/GroupObject');
var GroupApi = require('./apis/GroupApi');

var Kdb4Api = dejavu.Class.declare({
    $name: 'Kdb4Api',
    $implements: [DatabaseApiInterface],
    
    _parser: new xml2js.Parser({ explicitArray: false }),
    _builder: new xml2js.Builder({ explicitArray: false }),
    
    __rawDatabase: null,
    __database: null,
    __metaData: null,
    __groups: {},
    
    /**
     * Returns the version of the API. The API has always
     * the same version as the database, in this case (KDB)4.
     * 
     * @returns {number} The API version
     */
    getApiVersion: function() { return 4; },
    
    /**
     * Parses a buffer containing the raw database in XML format
     * so it can be accessed with the API later on. Should not
     * be called by the user.
     * 
     * @param {string} Buffer containing the database in XML format
     * @param {function} Callback function with signature: (err)
     */
    parseDatabase: function parseDatabase(databaseBuffer, cb) {
        this.__rawDatabase = databaseBuffer;
        
        this._parser.parseString(this.__rawDatabase.toString(), function(err, result) {
            if(err) return cb(err);
            
            if(!result.KeePassFile) {
                return cb(new Error('Invalid KeePass database - XML root node "KeePassFile" is missing.'));
            } else {
                this.__database = result.KeePassFile;
                this.__metaData = new MetaObject(this.__database.Meta);
                this.__groups = {};
                
                var dbRoot = this.__database.Root;
                for(var key in dbRoot) {
                    switch(key.toLowerCase()) {
                        case 'group':
                            this.__groups[dbRoot[key].UUID] = new GroupApi(new GroupObject(dbRoot[key]));
                            break;
                    }
                }
                
                return cb(null);    
            }
        }.$bind(this));
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
    groups: function(uuid) {
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