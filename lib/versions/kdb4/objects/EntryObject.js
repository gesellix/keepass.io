'use strict';
var dejavu = require('dejavu');
var types = require('../types');
var Parcelable = require('../../../common/Parcelable');
var ParcelableInterface = require('../../../interfaces/ParcelableInterface');
var DataObjectInterface = require('../../../interfaces/DataObjectInterface');

var EntryObject = dejavu.Class.declare({
    $name: 'EntryObject',
    $extends: Parcelable,
    $implements: [ParcelableInterface, DataObjectInterface],
    
    __data: {},
    
    pack: function() {
        
    },
    
    unpack: function(payload) {
        this.__data.uuid = types.unpack.string(payload.UUID);
        this.__data.iconId = types.unpack.number(payload.IconID);
        this.__data.foregroundColor = types.unpack.color(payload.ForegroundColor);
        this.__data.backgroundColor = types.unpack.color(payload.BackgroundColor);
        this.__data.overrideURL = types.unpack.string(payload.OverrideURL);
        this.__data.tags = types.unpack.string(payload.Tags);
        
        this.__data.times = {
            creation: types.unpack.date(payload.Times.CreationTime),
            lastModification: types.unpack.date(payload.Times.LastModificationTime),
            lastAccess: types.unpack.date(payload.Times.LastAccessTime),
            expiry: types.unpack.date(payload.Times.ExpiryTime),
            locationChanged: types.unpack.date(payload.Times.LocationChanged),
            
            expires: types.unpack.boolean(payload.Times.Expires),
            usageCount: types.unpack.number(payload.Times.UsageCount)
        };
        
        this.__data.autoType = {
            enabled: types.unpack.boolean(payload.AutoType.Enabled),
            dataTransferObfuscation: types.unpack.number(payload.AutoType.DataTransferObfuscation)
        };
        
        this.__data.strings = {};
        this.__unpackStrings(payload);
    },
    
    __unpackStrings: function(payload) {
        if(!payload.String) return null;
        var strings = Array.isArray(payload.String) ? payload.String : [payload.Strings];
        
        for(var key in strings) {
            this.__data.strings[strings[key].Key] = strings[key].Value;
        }    
    },
    
    handleMetaCall: function(parent, key, value) {
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
    
    handleStringCall: function(parent, key, value) {
        if(key === undefined) {
            return this.__data.strings;
        } else if(Object.prototype.toString.call(key) === '[object Object]') {
            var map = key;
            for(key in map) {
                this.__data.strings[key] = map[key];
            }
        } else if(value !== undefined) {
            this.__data.strings[key] = value;
        } else {
            return this.__data.strings[key];
        }
        
        return parent;         
    }
});

module.exports = EntryObject;