'use strict';
var dejavu = require('dejavu');

var DatabaseApi = dejavu.Interface.declare({
    $name: 'DatabaseApi',
    
    getApiVersion: function() {},
    getRawDatabase: function() {}
});

module.exports = DatabaseApi;