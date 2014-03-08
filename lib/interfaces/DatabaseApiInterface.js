'use strict';
var dejavu = require('dejavu');

var DatabaseApiInterface = dejavu.Interface.declare({
    $name: 'DatabaseApiInterface',
    
    getApiVersion: function() {},
    getRawDatabase: function() {}
});

module.exports = DatabaseApiInterface;