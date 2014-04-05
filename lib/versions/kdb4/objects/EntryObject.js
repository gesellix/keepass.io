'use strict';
var dejavu = require('dejavu');
var types = require('../types');
var Parcelable = require('../../../common/Parcelable');
var ParcelableInterface = require('../../../interfaces/ParcelableInterface');
var DataObjectInterface = require('../../../interfaces/DataObjectInterface');

var EntryApi = require('../apis/EntryApi');

var EntryObject = dejavu.Class.declare({
    $name: 'EntryObject',
    $extends: Parcelable,
    $implements: [ParcelableInterface, DataObjectInterface],
    
    __data: {},
    __history: {},

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
        this.__unpackHistoryEntries(payload);
    },
    
    __unpackStrings: function(payload) {
        if(!payload.String) return null;
        var strings = Array.isArray(payload.String) ? payload.String : [payload.Strings];
        var salsaManager = this.getParent().getSalsaManager();
        
        for(var key in strings) {
            if(strings[key].Value.$ && strings[key].Value.$.Protected) {
                var binaryString = new Buffer(strings[key].Value._, 'base64').toString('binary');
                this.__data.strings[strings[key].Key] = salsaManager.unpack(binaryString);
            } else {
                this.__data.strings[strings[key].Key] = strings[key].Value;
            }
        }    
    },
    
    __unpackHistoryEntries: function(payload) {
        if(!payload.History || !payload.History.Entry) return null;
        var entries = Array.isArray(payload.History.Entry) ? payload.History.Entry : [payload.History.Entry];
        
        for(var key in entries) {
            this.__history[entries[key].UUID] = new EntryApi(new EntryObject(entries[key], this.getParent()));
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