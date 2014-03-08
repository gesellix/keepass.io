'use strict';
var dejavu = require('dejavu');
var xml2js = require('xml2js');
var DatabaseApiInterface = require('../../interfaces/DatabaseApiInterface');

var MetaObject = require('./objects/MetaObject');

var Kdb4Api = dejavu.Class.declare({
    $name: 'Kdb4Api',
    $implements: [DatabaseApiInterface],
    
    _parser: new xml2js.Parser({ explicitArray: false }),
    _builder: new xml2js.Builder({ explicitArray: false }),
    
    __rawDatabase: null,
    __database: null,
    __data: {},
    
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
                this.__data['meta'] = new MetaObject(this.__database.Meta);
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
    }
});

module.exports = Kdb4Api;