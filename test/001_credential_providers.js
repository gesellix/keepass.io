var should = require('should');
var kpio = require('../lib');

describe('Instantiating a KeyfileCredential', function() {
    describe('by providing an inexistant keyfile', function() {
        it('should throw a Error', function() {
            (function() {
                new kpio.KeyfileCredential(null);
            }).should.throw();
        });
    });
});