'use strict';
var crypto = require('crypto');
var dejavu = require('dejavu');
var CredentialInterface = require('../interfaces/CredentialInterface');

var PasswordCredential = dejavu.Class.declare({
    $name: 'PasswordCredential',
    $implements: [CredentialInterface],
    $constants: {
        PRIORITY: 100
    },
    
    __hashBuffer: null,
    
    initialize: function(password) {
        this.__hashBuffer = crypto
            .createHash('sha256')
            .update(password, 'binary')
            .digest();
    },
    
    getPriority: function() {
        return this.$static.PRIORITY;
    },
    
    getFinalKey: function() {
        return this.__hashBuffer.toString('binary');
    },
    
    drop: function() {
        if(this.__hashBuffer) {
            this.__hashBuffer.fill('\0');
        }
    }
});

module.exports = PasswordCredential;