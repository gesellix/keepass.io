'use strict';
var dejavu = require('dejavu');

function generateUUID(a) {
    return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,generateUUID);
}

function wrapFunction(functionName, isDangerous) {
    return function() {
        this.__checkInstance();
        if(isDangerous) console.warn('You should not use \'' + functionName + '\' on a SecureBuffer! Please be careful...');
        return this.__instance[functionName].apply(this.__instance, arguments);
    }
}

function getCallerClass() {
    var stack = getStack();
    stack.shift();  // getCallerClass -> getStack
    stack.shift();  // initialize -> getCallerClass
    stack.shift();  // [dejavu] -> initialize
    
    if(stack && stack[1] && stack[1].receiver && stack[1].receiver.$name) {
        return stack[1].receiver.$name;
    } else {
        return 'Unknown';
    }
}

function getStack() {
    var originalPrepareStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = function(_, stack) {
        return stack;
    };
    
    var error = new Error();
    var stack = error.stack;
    Error.prepareStackTrace = originalPrepareStackTrace;
    
    stack.shift();  // getStack -> Error
    return stack;
}

var SecureBuffer = dejavu.Class.declare({
    $name: 'SecureBuffer',
    $statics: {
        __instances: {},
        
        dumpStatistics: function() {
            console.log('=== SecureBuffer statistics ===');
            console.log('Current count: ' + Object.keys(this.$static.__instances).length + ' buffers');
            
            for(var key in this.$static.__instances) {
                var instance = this.$static.__instances[key];
                console.log('[' + instance.getCaller() + '] ' + instance.getId() + '> ' + instance.__getRaw().length + ' bytes');
            }
        }
    },
    
    __id: null,
    __instance: null,
    __caller: null,
    
    initialize: function(initialContent, initialEncoding) {
        // Initialize some internal class proprrties
        if(!this.__caller) {
            this.__caller = getCallerClass();
        }
        this.__id = generateUUID();
        this.$static.__instances[this.__id] = this;
        
        // Create underlying buffer
        if(initialEncoding) {
            this.__instance = new Buffer(initialContent, initialEncoding);
        } else {
            this.__instance = new Buffer(initialContent);
        }
        
        // [DEBUG] Dump statistics
        this.$static.dumpStatistics();
    },
    
    isActive: function() {
        return this.__instance;
    },
    
    getId: function() {
        return this.__id;
    },
    
    getCaller: function() {
        return this.__caller;
    },
    
    drop: function() {
        // Check if instance is still active
        if(!this.__instance) return;
        
        // Remove instance from instances list, overwrite buffer and drop reference
        delete this.$static.__instances[this.__id];
        this.__instance.fill(0, 0, this.__instance.length);
        this.__instance = null;
        
        // [DEBUG] Dump statistics
        this.$static.dumpStatistics();
    },
    
    __getRaw: function() {
        return this.__instance;  
    },
    
    __checkInstance: function() {
        if(!this.__instance) {
            throw new Error('Tried to access a destroyed SecureBuffer.');
        }
    },
    
    // Dangerous wrapper functions
    copy: wrapFunction('copy', true),
    slice: wrapFunction('slice', true),
    toJSON: wrapFunction('toJSON', true),
    
    // Other wrapper functions
    write: wrapFunction('write'),
    toString: wrapFunction('toString'),
    readUInt8: wrapFunction('readUInt8'),
    readUInt16LE: wrapFunction('readUInt16LE'),
    readUInt16BE: wrapFunction('readUInt16BE'),
    readUInt32LE: wrapFunction('readUInt32LE'),
    readUInt32BE: wrapFunction('readUInt32BE'),
    readInt8: wrapFunction('readInt8'),
    readInt16LE: wrapFunction('readInt16LE'),
    readInt16BE: wrapFunction('readInt16BE'),
    readInt32LE: wrapFunction('readInt32LE'),
    readInt32BE: wrapFunction('readInt32BE'),
    readFloatLE: wrapFunction('readFloatLE'),
    readFloatBE: wrapFunction('readFloatBE'),
    readDoubleLE: wrapFunction('readDoubleLE'),
    readDoubleBE: wrapFunction('readDoubleBE'),
    writeUInt8: wrapFunction('writeUInt8'),
    writeUInt16LE: wrapFunction('writeUInt16LE'),
    writeUInt16BE: wrapFunction('writeUInt16BE'),
    writeUInt32LE: wrapFunction('writeUInt32LE'),
    writeUInt32BE: wrapFunction('writeUInt32BE'),
    writeInt8: wrapFunction('writeInt8'),
    writeInt16LE: wrapFunction('writeInt16LE'),
    writeInt16BE: wrapFunction('writeInt16BE'),
    writeInt32LE: wrapFunction('writeInt32LE'),
    writeInt32BE: wrapFunction('writeInt32BE'),
    writeFloatLE: wrapFunction('writeFloatLE'),
    writeFloatBE: wrapFunction('writeFloatBE'),
    writeDoubleLE: wrapFunction('writeDoubleLE'),
    writeDoubleBE: wrapFunction('writeDoubleBE'),
    fill: wrapFunction('fill')
});

module.exports = SecureBuffer;