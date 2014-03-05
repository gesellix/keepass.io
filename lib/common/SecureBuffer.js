'use strict';
var dejavu = require('dejavu');

function generateUUID(a) {
    return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,generateUUID);
}

function wrapFunction(functionName) {
    return function() {
        this.__checkInstance();
        return this.__instance[functionName].apply(this.__instance, arguments);
    }
}

function getCallerClass() {
    var stack = getStack();
    stack.shift();  // getCallerClass -> getStack
    stack.shift();  // initialize -> getCallerClass
    stack.shift();  // [Potential caller] -> initialize

    if(stack[1] && stack[1].receiver && stack[1].fun) {
        var functionName = /function ([^(]*)/.exec(stack[1].fun.toString())[1];
        var className = stack[1].receiver.$name;
        
        // Sometimes, SecureBuffer methods create a new SecureBuffer instance
        // for the user. To avoid that SecureBuffer gets mentioned as the listener,
        // we shift the stack multiple times more if necessary.
        while(className == 'SecureBuffer') {
            stack.shift();
            functionName = /function ([^(]*)/.exec(stack[1].fun.toString())[1];
            className = stack[1].receiver.$name;
        }
        
        if(className && className.trim().length > 0) {
            if(functionName && functionName.trim().length > 0) {
                return className + '@' + functionName;
            } else {
                return className + '@' + 'Unknown';
            }
        } else {
            return functionName;
        }
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
        
        dumpStatistics: function dumpStatistics() {
            console.log('=== SecureBuffer statistics ===');
            console.log('Current count: ' + Object.keys(this.$static.__instances).length + ' buffers');
            
            for(var key in this.$static.__instances) {
                var instance = this.$static.__instances[key];
                console.log('[' + instance.getCaller() + '] ' + instance.getId() + '> ' + instance.getLength() + ' bytes');
            }
            console.log('=== End of SecureBuffer statistics ===');
        }
    },
    
    __id: null,
    __instance: null,
    __caller: null,
    
    initialize: function initialize(initialContent, initialEncoding) {
        // Initialize some internal class proprrties
        if(!this.__caller) {
            this.__caller = getCallerClass();
        }
        this.__id = generateUUID();
        this.$static.__instances[this.__id] = this;
        
        // If 'initialContent' already contains a Buffer, wrap the existing instance
        if(Buffer.isBuffer(initialContent)) {
            this.__instance = initialContent;
            return;
        }
        
        // Create underlying buffer
        if(initialEncoding) {
            this.__instance = new Buffer(initialContent, initialEncoding);
        } else {
            this.__instance = new Buffer(initialContent);
        }
    },
    
    isActive: function isActive() {
        return this.__instance;
    },
    
    getId: function getId() {
        return this.__id;
    },
    
    getCaller: function getCaller() {
        return this.__caller;
    },
    
    getLength: function getLength() {
        return this.__instance.length;
    },
    
    drop: function drop() {
        // Check if instance is still active
        if(!this.__instance) return;
        
        // Remove instance from instances list, overwrite buffer and drop reference
        delete this.$static.__instances[this.__id];
        this.__instance.fill(0, 0, this.__instance.length);
        this.__instance = null;
    },
    
    __checkInstance: function __checkInstance() {
        if(!this.__instance) {
            throw new Error('Tried to access a destroyed SecureBuffer.');
        }
    },
    
    // A bit more dangerous wrapper functions
    copy: function copy() {
        var copiedBuffer = this.__instance.slice.apply(this.__instance, arguments);
        var secureBuffer = new SecureBuffer(copiedBuffer);
        return secureBuffer;
    },
    slice: function slice() {
        var slicedBuffer = this.__instance.slice.apply(this.__instance, arguments);
        var secureBuffer = new SecureBuffer(slicedBuffer);
        return secureBuffer;
    },
    
    // Other wrapper functions
    write: wrapFunction('write'),
    toString: wrapFunction('toString'),
    toJSON: wrapFunction('toJSON'),
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