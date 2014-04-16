'use strict';
var dejavu = require('dejavu');

var Parcelable = dejavu.AbstractClass.declare({
    $name: 'Parcelable',
    
    _parent: null,
    
    initialize: function initialize(payload, parent) {
        this._parent = parent;
        this.unpack(payload);
    },
    
    getParent: function getParent() {
        return this._parent;
    }
});

module.exports = Parcelable;