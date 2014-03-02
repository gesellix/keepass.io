'use strict';
var dejavu = require('dejavu');
var jspack = require('jspack').jspack;

var Helpers = dejavu.Class.declare({
    $name: 'Helpers',
    $statics: {
        __instance: null,
        
        getInstance: function() {
            if(!this.$static.__instance) {
                this.$static.__instance = new Helpers();
            }
            return this.$static.__instance;
        }
    },
    
    readBuffer: function(buffer, offset, length, type) {
        if(!type) type = 'I';
        var slicedBuffer = buffer.slice(offset, offset + length);
        return jspack.Unpack('<' + type, slicedBuffer, 0)[0];
    },
    
    readDatabaseSignatures: function(buffer) {
        return [
            this.readBuffer(buffer, 0, 4),  // Generic header signature
            this.readBuffer(buffer, 4, 4)   // Version-specific header signature
        ]
    }
});

module.exports = new Helpers();