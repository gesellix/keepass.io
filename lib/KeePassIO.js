'use strict';
var dejavu = require('dejavu');
var CredentialInterface = require('./interfaces/CredentialInterface');

var KeePassIO = dejavu.Class.declare({
    $name: 'KeePassIO',
    
    __credentials: [],
    
    addCredential: function(credential) {
        if(dejavu.instanceOf(credential, CredentialInterface)) {
            this.__credentials.push(credential);
        } else {
            throw new Error('The credential provider must implement "CredentialInterface".');
        }
    },
    
    dropAllCredentials: function() {
        this.__credentials.forEach(function(credential) {
            credential.drop();
        });
    }
    
});

module.exports = KeePassIO;