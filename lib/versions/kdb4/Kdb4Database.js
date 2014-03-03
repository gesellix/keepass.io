'use strict';
var dejavu = require('dejavu');
var DatabaseInterface = require('../../interfaces/DatabaseInterface');
var Helpers = (require('../../common/Helpers')).$static.getInstance();

var Kdb4Database = dejavu.Class.declare({
    $name: 'Kdb4Database',
    $implements: [DatabaseInterface],
    
    __fileBuffer: null,
    
    initialize: function(fileBuffer) {
        this.__fileBuffer = fileBuffer;
    },
    
    parse: function(cb) {
        cb(null);
    }
    
});

module.exports = Kdb4Database;