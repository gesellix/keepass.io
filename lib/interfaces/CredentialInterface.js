'use strict';
var dejavu = require('dejavu');

var CredentialInterface = dejavu.Interface.declare({
    $name: 'CredentialInterface',
    
    getFinalKey: function() {},
    getPriority: function() {},
    drop: function() {}
});

module.exports = CredentialInterface;