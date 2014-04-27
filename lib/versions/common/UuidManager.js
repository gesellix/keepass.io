'use strict';
var dejavu = require('dejavu');
var crypto = require('crypto');

var UuidManager = dejavu.Class.declare({
    $name: 'UuidManager',
    $statics: {
        USED: 1,
        DELETED: 2
    },
    
    __usedUuids: [],
    
    /**
     * Generates a new, unique UUID which can be used to
     * add groups and entries to the database. This function
     * does not mark the new UUID as used, so you'll have to do
     * that as soon as you use it.
     * 
     * @return {string} Base64 encoded UUID
     */
    generate: function generate() {
        do {
            var uuidBuffer = crypto.pseudoRandomBytes(16);
            var uuidString = uuidBuffer.toString('base64');
        } while(!this.isUnique(uuidString));
        
        return uuidString;
    },
    
    /**
     * Checks if the given UUID is unique, i.e. if it was never
     * used or deleted before. You should always call this function
     * when generating a new UUID yourself, to avoid collisions.
     * 
     * @param {string} uuid Base64 encoded UUID
     * 
     * @returns {boolean} Returns true if the UUID is unique
     */
    isUnique: function isUuid(uuid) {
        return !this.__usedUuids[uuid];
    },
    
    /**
     * Checks if the given UUID is currently in use. Do not
     * use this function when generating a new UUID, as it does
     * not check if the UUID was deleted before.
     * 
     * @param {string} uuid Base64 encoded UUID
     * 
     * @returns {boolean} Returns true if the UUID is currently in use
     */
    isUsed: function isUsed(uuid) {
        return this.__usedUuids[uuid] === this.$static.USED;
    },
    
    /**
     * Checks if the given UUID was deleted before. Do not
     * use this function when generating a new UUID, as it does
     * not check if the UUID is currently in use.
     * 
     * @param {string} uuid Base64 encoded UUID
     * 
     * @returns {boolean} Returns true if the UUID was deleted before
     */
    isDeleted: function isDeleted(uuid) {
        return this.__usedUuids[uuid] === this.$static.DELETED;
    },
    
    /**
     * Marks the given UUID as unused.
     * 
     * @param {string} uuid Base64 encoded UUID
     */
    markUnused: function markUnused(uuid) {
        delete this.__usedUuids[uuid];
    },
    
    /**
     * Marks the given UUID as used.
     * 
     * @param {string} uuid Base64 encoded UUID
     */
    markUsed: function markUsed(uuid) {
        this.__usedUuids[uuid] = this.$static.USED;
    },
    
    /**
     * Marks the given UUID as deleted.
     * 
     * @param {string} uuid Base64 encoded UUID
     */
    markDeleted: function markDeleted(uuid) {
        this.__usedUuids[uuid] = this.$static.DELETED;
    },
    
    
    /**
     * Prints out the current count of used and deleted UUIDs.
     * Only useful for debug purposes, should not be used in
     * production as it loops through the whole array.
     */
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