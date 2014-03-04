'use strict';
var crypto = require('crypto');
var dejavu = require('dejavu');
var SecureBuffer = require('../common/SecureBuffer');
var CredentialInterface = require('../interfaces/CredentialInterface');

var PasswordCredential = dejavu.Class.declare({
    $name: 'PasswordCredential',
    $implements: [CredentialInterface],
    $constants: {
        PRIORITY: 100
    },
    
    __hashBuffer: null,
    
    initialize: function initialize(password) {
        var passwordHash = crypto
            .createHash('sha256')
            .update(password, 'binary')
            .digest('binary');
        
        this.__hashBuffer = new SecureBuffer(passwordHash, 'binary');
    },
    
    getPriority: function getPriority() {
        return this.$static.PRIORITY;
    },
    
    getFinalKey: function getFinalKey() {
        return this.__hashBuffer;
    },
    
    drop: function drop() {
        if(this.__hashBuffer) this.__hashBuffer.drop();
    }
});

module.exports = PasswordCredential;