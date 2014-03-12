'use strict';
var dejavu = require('dejavu');

var DataObjectInterface = dejavu.Interface.declare({
    $name: 'DataObjectInterface',
    
    handleCall: function(parent, key, value) {} 
});

module.exports = DataObjectInterface;