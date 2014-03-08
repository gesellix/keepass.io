'use strict';
var dejavu = require('dejavu');

var DatabaseInterface = dejavu.Interface.declare({
    $name: 'DatabaseInterface',
    
    load: function(cb) {},
    getApi: function() {}
});

module.exports = DatabaseInterface;