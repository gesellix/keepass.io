'use strict';
var dejavu = require('dejavu');

var GroupApi = dejavu.Class.declare({
    $name: 'GroupApi',
    
    __object: null,
    
    initialize: function initialize(groupObject) {
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
    
    /**
     * If the parameter uuid was not specified, a list of all subgroups will
     * be returned. The list always has the subgroup UUID as the key and the
     * subgroup api instance as its value.
     * 
     * If a uuid was specified, it will try to find a subgroup with the given uuid
     * and return it. If it was not found, an error will be thrown.
     */
    groups: function groups(uuid) {
        var subgroups = this.__object.getGroups();
        if(uuid === undefined) {
            return subgroups;
        } else {
            if(subgroups[uuid]) {
                return subgroups[uuid];
            } else {
                throw new Error('There is no subgroup with the following UUID: ' + uuid);
            }
        }
    },
    
    /**
     * If the parameter uuid was not specified, a list of all entries will
     * be returned. The list always has the entry UUID as the key and the
     * entry api instance as its value.
     * 
     * If a uuid was specified, it will try to find a entry with the given uuid
     * and return it. If it was not found, an error will be thrown.
     */
    entries: function entries(uuid) {
        var entries = this.__object.getEntries();
        if(uuid === undefined) {
            return entries;
        } else {
            if(entries[uuid]) {
                return entries[uuid];
            } else {
                throw new Error('There is no entry with the following UUID: ' + uuid);
            }
        }
    }
});

module.exports = GroupApi;