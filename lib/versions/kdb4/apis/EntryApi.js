'use strict';
var dejavu = require('dejavu');

var EntryApi = dejavu.Class.declare({
    $name: 'EntryApi',
    
    __object: null,
    
    initialize: function initialize(entryObject) {
        this.__object = entryObject;
    },
    
    /**
     * Provides access to the meta data of the entry
     * 
     * meta()                   => Returns all meta data
     * meta('hello')            => Returns the meta data value of 'hello'
     * meta('hello', 'world')   => Sets the meta data value of 'hello' to 'world'
     * meta({ a: 1, b: 2 })     => Same as the method above, but provides the ability to modify multiple values at once
     */
    meta: function meta() {
        var args = Array.prototype.slice.apply(arguments);
        args.unshift(this);
        return this.__object.handleMetaCall.apply(this.__object, args);
    },
    
    strings: function string() {
        var args = Array.prototype.slice.apply(arguments);
        args.unshift(this);
        return this.__object.handleStringsCall.apply(this.__object, args);
    }
});

module.exports = EntryApi;