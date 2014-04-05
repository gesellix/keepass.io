'use strict';
var dejavu = require('dejavu');

var Parcelable = dejavu.AbstractClass.declare({
    $name: 'Parcelable',
    
    _parent: null,
    
    initialize: function(payload, parent) {
        this._parent = parent;
        this.unpack(payload);
    },
    
    getParent: function() {
        return this._parent;
    }
});

module.exports = Parcelable;