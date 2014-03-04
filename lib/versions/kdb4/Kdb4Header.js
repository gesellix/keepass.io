'use strict';
var dejavu = require('dejavu');
var jspack = require('jspack').jspack;

/* POINT OF ADVICE: Header fields are stored unencrypted in the database file,
    so it does not make any sense to use the slower SecureBuffer class. */

var Kdb4Header = dejavu.Class.declare({
    $name: 'Kdb4Header',
    
    __fields: {},
    __formats: {},
    __data: {},
    
    initialize: function initialize(options) {
        if(!options) return;
        if(options.hasOwnProperty('fields')) this.__fields = options.fields;
        if(options.hasOwnProperty('formats')) this.__formats = options.formats;
        
        for(var key in this.__fields) {
            this.__data[this.__fields[key]] = undefined;
        }
    },
    
    getRaw: function getRaw(identifier) {
        var fieldID = this.resolveField(identifier);
        if(this.__formats.hasOwnProperty(fieldID)) {
            return jspack.Pack(this.__formats[fieldID], this.__data[fieldID]);
        } else {
            return this.get(identifier);
        }
    },
    
    get: function get(identifier) {
        return this.__data[this.resolveField(identifier)];
    },
    
    setRaw: function setRaw(identifier, value) {
        this.__data[this.resolveField(identifier)] = value;
    },
    
    set: function set(identifier, value) {
        var fieldID = this.resolveField(identifier);
        if(this.__formats.hasOwnProperty(fieldID)) {
            this.__data[fieldID] = jspack.Unpack(this.__formats[fieldID], new Buffer(value), 0)[0];
        } else {
            return this.setRaw(identifier, value);
        }
    },
    
    dump: function dump() {
        console.log('=== KDB4 header dump ===');
        for(var fieldName in this.__fields) {
            var fieldID = this.__fields[fieldName];
            if(this.__formats.hasOwnProperty(fieldID)) {
                console.log(fieldID + ':' + fieldName + ' => ' + this.get(fieldID));
            } else {
                if(this.__data[fieldID]) {
                    console.log(fieldID + ':' + fieldName + ' => ' + new Buffer(this.__data[fieldID]).toString('hex'));
                } else {
                    console.log(fieldID + ':' + fieldName + ' => ' + this.__data[fieldID]);
                }
            }
        }
        console.log('=== End of KDB4 header dump ===')
    },
    
    hasField: function hasField(identifier) {
        return (this.__data.hasOwnProperty(identifier) || this.__fields.hasOwnProperty(identifier));
    },
    
    resolveField: function resolveField(identifier) {
        if(this.__data.hasOwnProperty(identifier)) return identifier;
        if(this.__fields.hasOwnProperty(identifier)) return this.__fields[identifier];
        throw new Error('Could not resolve header field: ' + identifier);
    }
});

module.exports = Kdb4Header;