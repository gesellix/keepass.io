'use strict';
var dejavu = require('dejavu');
var jspack = require('jspack').jspack;
var crypto = require('crypto');

var Helpers = dejavu.Class.declare({
    $name: 'Helpers',
    $statics: {
        __instance: null,
        
        getInstance: function getInstance() {
            if(!this.$static.__instance) {
                this.$static.__instance = new Helpers();
            }
            return this.$static.__instance;
        }
    },
    
    readBuffer: function readBuffer(buffer, offset, length, type) {
        if(!type) type = 'I';
        var slicedBuffer = buffer.slice(offset, offset + length);
        return jspack.Unpack('<' + type, slicedBuffer, 0)[0];
    },
    
    readDatabaseSignatures: function readDatabaseSignatures(buffer) {
        return [
            this.readBuffer(buffer, 0, 4),  // Generic header signature
            this.readBuffer(buffer, 4, 4)   // Version-specific header signature
        ]
    },
    
    transformKey: function transformKey(key, seed, rounds) {
        var iv = new Buffer(0);
        
        for(var round = 0; round < rounds; round++) {
            var cipher = crypto.createCipheriv('aes-256-ecb', seed, iv);
            cipher.setAutoPadding(false);
            key = cipher.update(key, 'binary', 'binary') + cipher.final('binary');
        }
        
        return key;
    }
});

module.exports = new Helpers();