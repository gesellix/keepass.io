'use strict';
var dejavu = require('dejavu');

var DatabaseInterface = dejavu.Interface.declare({
    $name: 'DatabaseInterface',
    
    parse: function(cb) {}
});

module.exports = DatabaseInterface;