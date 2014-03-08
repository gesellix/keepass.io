'use strict';
var dejavu = require('dejavu');

var Parcelable = dejavu.AbstractClass.declare({
    $name: 'Parcelable',
    
    initialize: function(payload) {
        this.unpack(payload);
    }
});

module.exports = Parcelable;