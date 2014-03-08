'use strict';
var crypto = require('crypto');
var SecureBuffer = require('../../common/SecureBuffer');
var dejavu = require('dejavu');

var HashedBlockIO = dejavu.Class.declare({
    $name: 'HashedBlockIO',
    $statics: {
        __instance: null,
        
        getInstance: function getInstance() {
            if(!this.$static.__instance) {
                this.$static.__instance = new HashedBlockIO();
            }
            return this.$static.__instance;
        }
    },
    
    decrypt: function decrypt(dataBuffer) {
        var hbioBuffer = new SecureBuffer(dataBuffer.getLength());
        var currentOffset = 0, realOffset = 0;
        var blockIndex, blockHash, blockLength, blockData, calculatedHash;
        
        // Process all HBIO blocks until there aren't any left.
        do {
            blockIndex = dataBuffer.readUInt32LE(currentOffset); currentOffset += 4;
            blockHash = dataBuffer.toString('hex', currentOffset, currentOffset + 32); currentOffset += 32;
            blockLength = dataBuffer.readUInt32LE(currentOffset); currentOffset += 4;
            
            if(blockLength > 0) {
                // Read block data and calculate SHA256 hash
                blockData = dataBuffer.toString('binary', currentOffset, currentOffset + blockLength); currentOffset += blockLength;
                calculatedHash = crypto.createHash('sha256').update(blockData, 'binary').digest('hex');
                
                // Compare hashes
                if(blockHash !== calculatedHash) {
                    throw new Error('HBIO hash mismatch. The database file might be corrupt.');
                } else {
                    hbioBuffer.write(blockData, realOffset, blockLength, 'binary');
                    realOffset += blockLength;
                }
            }
        } while(blockLength !== 0);
        
        var slicedHbioBuffer = hbioBuffer.slice(0, realOffset);
        hbioBuffer.drop();
        return slicedHbioBuffer;
    }
});

module.exports = HashedBlockIO;