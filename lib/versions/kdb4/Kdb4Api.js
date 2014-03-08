'use strict';
var dejavu = require('dejavu');
var DatabaseApi = require('../../interfaces/DatabaseApi');

var Kdb4Api = dejavu.Class.declare({
    $name: 'Kdb4Api',
    $implements: [DatabaseApi],
    
    __database: null,
    
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
     */
    parseDatabase: function parseDatabase(databaseBuffer) {
        this.__database = databaseBuffer;
    },
    
    /**
     * Returns the raw database without any modifications.
     * Remember that Salsa20 protected passwors won't be
     * decrypted too.
     * 
     * @returns {string} The database in XML format
     */
    getRawDatabase: function getRawDatabase() {
        return this.__database.toString();
    }
});

module.exports = Kdb4Api;