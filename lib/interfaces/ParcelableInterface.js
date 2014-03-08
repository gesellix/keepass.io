'use strict';
var dejavu = require('dejavu');

var ParcelableInterface = dejavu.Interface.declare({
    $name: 'ParcelableInterface',
    
    pack: function() {},
    unpack: function(payload) {}
});

module.exports = ParcelableInterface;