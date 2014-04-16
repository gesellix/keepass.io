'use strict';

var types = module.exports = {
    pack: {
        
    },
    
    unpack: {
        string: function string(value) {
            if(typeof value !== 'string') return undefined;
            return value;
        },
        
        number: function number(value) {
            if(!isFinite(value) || isNaN(value)) return undefined;
            return +value;
        },
        
        date: function date(payload) {
            var timestamp = Date.parse(payload);
            if(!isNaN(timestamp)) {
                return new Date(timestamp);
            } else {
                return undefined;
            }
        },
        
        boolean: function boolean(payload) {
            if(payload === 'null') return undefined;
            return !!(payload === 'True');
        },
        
        color: function color(payload) {
            return types.unpack.string(payload);
        }
    }
};