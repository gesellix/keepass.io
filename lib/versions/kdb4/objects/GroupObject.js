'use strict';
var dejavu = require('dejavu');
var types = require('../types');
var Parcelable = require('../../../common/Parcelable');
var ParcelableInterface = require('../../../interfaces/ParcelableInterface');
var DataObjectInterface = require('../../../interfaces/DataObjectInterface');

var EntryObject = require('./EntryObject');
var EntryApi = require('../apis/EntryApi');
var GroupApi = require('../apis/GroupApi');

var GroupObject = dejavu.Class.declare({
    $name: 'GroupObject',
    $extends: Parcelable,
    $implements: [ParcelableInterface, DataObjectInterface],
    
    __data: {},
    __groups: {},
    __entries: {},
    
    pack: function pack() {
        return {
            UUID: types.pack.string(this.__data.uuid),
            Name: types.pack.string(this.__data.name),
            Notes: types.pack.string(this.__data.notes),
            IconID: types.pack.number(this.__data.iconId),
            
            Times: {
                CreationTime: types.pack.date(this.__data.times.creation),
                LastModificationTime: types.pack.date(this.__data.times.lastModification),
                LastAccessTime: types.pack.date(this.__data.times.lastAccess),
                ExpiryTime: types.pack.date(this.__data.times.expiry),
                LocationChanged: types.pack.date(this.__data.times.locationChanged),
                
                Expires: types.pack.boolean(this.__data.times.expires),
                UsageCount: types.pack.number(this.__data.times.usageCount)
            },
            
            IsExpanded: types.pack.boolean(this.__data.isExpanded),
            DefaultAutoTypeSequence: types.pack.string(this.__data.defaultAutoTypeSequence),
            EnableAutoType: types.pack.boolean(this.__data.enableAutoType),
            EnableSearching: types.pack.boolean(this.__data.enableSearching),
            LastTopVisibleEntry: types.pack.string(this.__data.lastTopVisibleEntry)
            
            // TODO: Pack subgroups & entries
        };
    },
    
    unpack: function unpack(payload) {
        this.__data.uuid = types.unpack.string(payload.UUID);
        this.__data.name = types.unpack.string(payload.Name);
        this.__data.notes = types.unpack.string(payload.Notes);
        this.__data.iconId = types.unpack.number(payload.IconID);
        
        this.__data.times = {
            creation: types.unpack.date(payload.Times.CreationTime),
            lastModification: types.unpack.date(payload.Times.LastModificationTime),
            lastAccess: types.unpack.date(payload.Times.LastAccessTime),
            expiry: types.unpack.date(payload.Times.ExpiryTime),
            locationChanged: types.unpack.date(payload.Times.LocationChanged),
            
            expires: types.unpack.boolean(payload.Times.Expires),
            usageCount: types.unpack.number(payload.Times.UsageCount)
        };
        
        this.__data.isExpanded = types.unpack.boolean(payload.IsExpanded);
        this.__data.defaultAutoTypeSequence = types.unpack.string(payload.DefaultAutoTypeSequence);
        this.__data.enableAutoType = types.unpack.boolean(payload.EnableAutoType);
        this.__data.enableSearching = types.unpack.boolean(payload.EnableSearching);
        this.__data.lastTopVisibleEntry = types.unpack.string(payload.LastTopVisibleEntry);
        
        // Hint: The entries -must- be parsed first, otherwise the Salsa20
        // decryption order is no longer valid.
        this.__groups = {};
        this.__entries = {};
        this.__parseEntries(payload);
        this.__parseGroups(payload);
    },
    
    __parseGroups: function __parseGroups(payload) {
        if(!payload.Group) return null;
        var groups = Array.isArray(payload.Group) ? payload.Group : [payload.Group];
        
        for(var key in groups) {
            this.__groups[groups[key].UUID] = new GroupApi(new GroupObject(groups[key], this.getParent()));
        }
    },
    
    __parseEntries: function __parseEntries(payload) {
        if(!payload.Entry) return null;
        var entries = Array.isArray(payload.Entry) ? payload.Entry : [payload.Entry];
        
        for(var key in entries) {
            this.__entries[entries[key].UUID] = new EntryApi(new EntryObject(entries[key], this.getParent()));
        }
    },
    
    handleMetaCall: function handleMetaCall(parent, key, value) {
        if(key === undefined) {
            return this.__data;
        } else if(Object.prototype.toString.call(key) === '[object Object]') {
            var map = key;
            for(key in map) {
                this.__data[key] = map[key];
            }
        } else if(value !== undefined) {
            this.__data[key] = value;
        } else {
            return this.__data[key];
        }
        
        return parent;
    },
    
    /**
     * Getters
     */
    getGroups: function getGroups() { return this.__groups; },
    getEntries: function getEntries() { return this.__entries; }
});

module.exports = GroupObject;