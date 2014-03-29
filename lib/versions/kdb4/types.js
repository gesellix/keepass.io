'use strict';

var types = module.exports = {
    pack: {
        
    },
    
    unpack: {
        string: function(value) {
            if(typeof value !== 'string') return undefined;
            return value;
        },
        
        number: function(value) {
            if(!isFinite(value) || isNaN(value)) return undefined;
            return +value;
        },
        
        date: function(payload) {
            var timestamp = Date.parse(payload);
            if(!isNaN(timestamp)) {
                return new Date(timestamp);
            } else {
                return undefined;
            }
        },
        
        boolean: function(payload) {
            if(payload === 'null') return undefined;
            return !!(payload === 'True');
        },
        
        color: function(payload) {
            return types.unpack.string(payload);
        }
    }
};