'use strict';
var dejavu = require('dejavu');
var types = require('../types');
var Parcelable = require('../../../common/Parcelable');
var ParcelableInterface = require('../../../interfaces/ParcelableInterface');
var DataObjectInterface = require('../../../interfaces/DataObjectInterface');

var MetaObject = dejavu.Class.declare({
    $name: 'MetaObject',
    $extends: Parcelable,
    $implements: [ParcelableInterface, DataObjectInterface],
    
    __data: {},
    
    pack: function() {
        return {
            Generator: types.pack.string(this.__data.generator),
            DatabaseName: types.pack.string(this.__data.dbName),
            DatabaseNameChanged: types.pack.date(this.__data.dbNameChanged),
            DatabaseDescription: types.pack.string(this.__data.dbDescription),
            DatabaseDescriptionChanged: types.pack.date(this.__data.dbDescriptionChanged),
            DefaultUserName: types.pack.string(this.__data.defaultUserName),
            DefaultUserNameChanged: types.pack.date(this.__data.defaultUserNameChanged),
            MaintenanceHistoryDays: types.pack.number(this.__data.maintenanceHistoryDays),
            Color: types.pack.color(this.__data.color),
            
            MasterKeyChanged: types.pack.date(this.__data.masterKeyChanged),
            MasterKeyChangeRec: types.pack.number(this.__data.masterKeyChangeRec),
            MasterKeyChangeForce: types.pack.number(this.__data.masterKeyChangeForce),
            
            MemoryProtection: {
                ProtectTitle: types.pack.boolean(this.__data.memoryProtection.title),
                ProtectUserName: types.pack.boolean(this.__data.memoryProtection.username),
                ProtectPassword: types.pack.boolean(this.__data.memoryProtection.password),
                ProtectURL: types.pack.boolean(this.__data.memoryProtection.url),
                ProtectNotes: types.pack.boolean(this.__data.memoryProtection.notes)
            },
            
            RecycleBinEnabled: types.pack.boolean(this.__data.recycleBin.enabled),
            RecycleBinUUID: types.pack.string(this.__data.recycleBin.uuid),
            RecycleBinChanged: types.pack.date(this.__data.recycleBin.changed),
            
            EntryTemplatesGroup: types.pack.string(this.__data.entryTemplatesGroup),
            EntryTemplatesGroupChanged: types.pack.date(this.__data.entryTemplatesGroupChanged),
            HistoryMaxItems: types.pack.number(this.__data.historyMaxItems),
            HistoryMaxSize: types.pack.number(this.__data.historyMaxSize),
            LastSelectedGroup: types.pack.string(this.__data.lastSelectedGroup),
            LastTopVisibleGroup: types.pack.string(this.__data.lastTopVisibleGroup),
            
            Binaries: this.__data.$binaries,
            CustomData: this.__data.$customData
        };
    },
    
    unpack: function(payload) {
        this.__data.generator = types.unpack.string(payload.Generator);
        this.__data.dbName = types.unpack.string(payload.DatabaseName);
        this.__data.dbNameChanged = types.unpack.date(payload.DatabaseNameChanged);
        this.__data.dbDescription = types.unpack.string(payload.DatabaseDescription);
        this.__data.dbDescriptionChanged = types.unpack.date(payload.DatabaseDescriptionChanged);
        this.__data.defaultUserName = types.unpack.string(payload.DefaultUserName);
        this.__data.defaultUserNameChanged = types.unpack.date(payload.DefaultUserNameChanged);
        this.__data.maintenanceHistoryDays = types.unpack.number(payload.MaintenanceHistoryDays);
        this.__data.color = types.unpack.color(payload.Color);
        
        this.__data.masterKeyChanged = types.unpack.date(payload.MasterKeyChanged);
        this.__data.masterKeyChangeRec = types.unpack.number(payload.MasterKeyChangeRec);
        this.__data.masterKeyChangeForce = types.unpack.number(payload.MasterKeyChangeForce);
        
        this.__data.memoryProtection = {
            title: types.unpack.boolean(payload.MemoryProtection.ProtectTitle),
            username: types.unpack.boolean(payload.MemoryProtection.ProtectUserName),
            password: types.unpack.boolean(payload.MemoryProtection.ProtectPassword),
            url: types.unpack.boolean(payload.MemoryProtection.ProtectURL),
            notes: types.unpack.boolean(payload.MemoryProtection.ProtectNotes)
        };
        this.__data.recycleBin = {
            enabled: types.unpack.boolean(payload.RecycleBinEnabled),
            uuid: types.unpack.string(payload.RecycleBinUUID),
            changed: types.unpack.date(payload.RecycleBinChanged)
        };
        
        this.__data.entryTemplatesGroup = types.unpack.string(payload.EntryTemplatesGroup);
        this.__data.entryTemplatesGroupChanged = types.unpack.date(payload.EntryTemplatesGroupChanged);
        this.__data.historyMaxItems = types.unpack.number(payload.HistoryMaxItems);
        this.__data.historyMaxSize = types.unpack.number(payload.HistoryMaxSize);
        this.__data.lastSelectedGroup = types.unpack.string(payload.LastSelectedGroup);
        this.__data.lastTopVisibleGroup = types.unpack.string(payload.LastTopVisibleGroup);
        
        this.__data.$binaries = payload.Binaries;
        this.__data.$customData = payload.CustomData;
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
    }
});

module.exports = MetaObject;