'use strict';
var dejavu = require('dejavu');
var types = require('../types');
var Parcelable = require('../../../common/Parcelable');
var ParcelableInterface = require('../../../interfaces/ParcelableInterface');

var MetaObject = dejavu.Class.declare({
    $name: 'MetaObject',
    $extends: Parcelable,
    $implements: [ParcelableInterface],
    
    __generator: null,
    __dbName: null,
    __dbNameChanged: null,
    __dbDescription: null,
    __dbDescriptionChanged: null,
    __defaultUserName: null,
    __defaultUserNameChanged: null,
    __maintenanceHistoryDays: null,
    __color: null,
    
    __masterKeyChanged: null,
    __masterKeyChangeRec: null,
    __masterKeyChangeForce: null,
    
    __memoryProtection: null,
    __recycleBin: null,
    
    __entryTemplatesGroup: null,
    __entryTemplatesGroupChanged: null,
    __historyMaxItems: null,
    __historyMaxSize: null,
    __lastSelectedGroup: null,
    __lastTopVisibleGroup: null,
    
    __$binaries: null,
    __$customData: null,
    
    pack: function() {
        return {
            Generator: types.pack.string(this.__generator),
            DatabaseName: types.pack.string(this.__dbName),
            DatabaseNameChanged: types.pack.date(this.__dbNameChanged),
            DatabaseDescription: types.pack.string(this.__dbDescription),
            DatabaseDescriptionChanged: types.pack.date(this.__dbDescriptionChanged),
            DefaultUserName: types.pack.string(this.__defaultUserName),
            DefaultUserNameChanged: types.pack.date(this.__defaultUserNameChanged),
            MaintenanceHistoryDays: types.pack.number(this.__maintenanceHistoryDays),
            Color: types.pack.color(this.__color),
            
            MasterKeyChanged: types.pack.date(this.__masterKeyChanged),
            MasterKeyChangeRec: types.pack.number(this.__masterKeyChangeRec),
            MasterKeyChangeForce: types.pack.number(this.__masterKeyChangeForce),
            
            MemoryProtection: {
                ProtectTitle: types.pack.boolean(this.__memoryProtection.title),
                ProtectUserName: types.pack.boolean(this.__memoryProtection.username),
                ProtectPassword: types.pack.boolean(this.__memoryProtection.password),
                ProtectURL: types.pack.boolean(this.__memoryProtection.url),
                ProtectNotes: types.pack.boolean(this.__memoryProtection.notes)
            },
            
            RecycleBinEnabled: types.pack.boolean(this.__recycleBin.enabled),
            RecycleBinUUID: types.pack.string(this.__recycleBin.uuid),
            RecycleBinChanged: types.pack.date(this.__recycleBin.changed),
            
            EntryTemplatesGroup: types.pack.string(this.__entryTemplatesGroup),
            EntryTemplatesGroupChanged: types.pack.date(this.__entryTemplatesGroupChanged),
            HistoryMaxItems: types.pack.number(this.__historyMaxItems),
            HistoryMaxSize: types.pack.number(this.__historyMaxSize),
            LastSelectedGroup: types.pack.string(this.__lastSelectedGroup),
            LastTopVisibleGroup: types.pack.string(this.__lastTopVisibleGroup),
            
            Binaries: this.__$binaries,
            CustomData: this.__$customData
        };
    },
    
    unpack: function(payload) {
        this.__generator = types.unpack.string(payload.Generator);
        this.__dbName = types.unpack.string(payload.DatabaseName);
        this.__dbNameChanged = types.unpack.date(payload.DatabaseNameChanged);
        this.__dbDescription = types.unpack.string(payload.DatabaseDescription);
        this.__dbDescriptionChanged = types.unpack.date(payload.DatabaseDescriptionChanged);
        this.__defaultUserName = types.unpack.string(payload.DefaultUserName);
        this.__defaultUserNameChanged = types.unpack.date(payload.DefaultUserNameChanged);
        this.__maintenanceHistoryDays = types.unpack.number(payload.MaintenanceHistoryDays);
        this.__color = types.unpack.color(payload.Color);
        
        this.__masterKeyChanged = types.unpack.date(payload.MasterKeyChanged);
        this.__masterKeyChangeRec = types.unpack.number(payload.MasterKeyChangeRec);
        this.__masterKeyChangeForce = types.unpack.number(payload.MasterKeyChangeForce);
        
        this.__memoryProtection = {
            title: types.unpack.boolean(payload.MemoryProtection.ProtectTitle),
            username: types.unpack.boolean(payload.MemoryProtection.ProtectUserName),
            password: types.unpack.boolean(payload.MemoryProtection.ProtectPassword),
            url: types.unpack.boolean(payload.MemoryProtection.ProtectURL),
            notes: types.unpack.boolean(payload.MemoryProtection.ProtectNotes)
        };
        this.__recycleBin = {
            enabled: types.unpack.boolean(payload.RecycleBinEnabled),
            uuid: types.unpack.string(payload.RecycleBinUUID),
            changed: types.unpack.date(payload.RecycleBinChanged)
        };
        
        this.__entryTemplatesGroup = types.unpack.string(payload.EntryTemplatesGroup);
        this.__entryTemplatesGroupChanged = types.unpack.date(payload.EntryTemplatesGroupChanged);
        this.__historyMaxItems = types.unpack.number(payload.HistoryMaxItems);
        this.__historyMaxSize = types.unpack.number(payload.HistoryMaxSize);
        this.__lastSelectedGroup = types.unpack.string(payload.LastSelectedGroup);
        this.__lastTopVisibleGroup = types.unpack.string(payload.LastTopVisibleGroup);
        
        this.__$binaries = payload.Binaries;
        this.__$customData = payload.CustomData;
    }
});

module.exports = MetaObject;