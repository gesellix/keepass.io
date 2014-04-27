'use strict';
var dejavu = require('dejavu');

var UuidManager = dejavu.Class.declare({
    $name: 'UuidManager',
    $statics: {
        USED: 1,
        DELETED: 2
    },
    
    __usedUuids: [],
    
    isUnique: function isUuid(uuid) {
        return !this.__usedUuids[uuid];
    },
    isUsed: function isUsed(uuid) {
        return this.__usedUuids[uuid] === this.$static.USED;
    },
    isDeleted: function isDeleted(uuid) {
        return this.__usedUuids[uuid] === this.$static.DELETED;
    },
    
    markUnused: function markUnused(uuid) {
        delete this.__usedUuids[uuid];
    },
    markUsed: function markUsed(uuid) {
        this.__usedUuids[uuid] = this.$static.USED;
    },
    markDeleted: function markDeleted(uuid) {
        this.__usedUuids[uuid] = this.$static.DELETED;
    },
    
    dumpStatistics: function dumpStatistics() {
        var usedCount = 0, deletedCount = 0;
        for(var key in this.__usedUuids) {
            switch(this.__usedUuids[key]) {
                case this.$static.USED: usedCount++; break;
                case this.$static.DELETED: deletedCount++; break;
            }
        }
        
        console.log('=== UuidManager statistics ===');
        console.log('Used UUIDs: ' + usedCount);
        console.log('Deleted UUIDs: ' + deletedCount);
        console.log('=== End of UuidManager statistics ===');
    }
});

module.exports = UuidManager;