'use strict';
var dejavu = require('dejavu');

var GroupApi = dejavu.Class.declare({
    $name: 'GroupApi',
    
    __object: null,
    
    initialize: function(groupObject) {
        this.__object = groupObject;
    },
    
    /**
     * Provides access to the meta data of the group
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
});

module.exports = GroupApi;