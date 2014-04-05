var should = require('should');
var helpers = require('./000_test_helpers')
var kpio = require('../lib');

describe('Instantiating a PasswordCredential', function() {
    describe('by providing anything else than a string', function() {
        it('should return an error', function() {
            (function withNull() {
                new kpio.PasswordCredential(null);
            }).should.throw();
            (function withNumber() {
                new kpio.PasswordCredential(123);
            }).should.throw();
            (function withArray() {
                new kpio.PasswordCredential([]);
            }).should.throw();
            (function withFunction() {
                new kpio.PasswordCredential(function() {});
            }).should.throw();
            (function withObject() {
                new kpio.PasswordCredential({});
            }).should.throw();
            (function withBuffer() {
                new kpio.PasswordCredential(new Buffer());
            }).should.throw();
        });
    });
    
    describe('by providing a random string', function() {
        var password;
        before(function() {
            password = new kpio.PasswordCredential('~random~password~');
        });
        
        it('and calling getFinalKey() should return a valid SecureBuffer', function() {
            password.getFinalKey().should.have.property('$name', 'SecureBuffer');
        });
        
        it('and calling drop() should return null when later calling getFinalKey()', function() {
            password.drop();
            should(password.getFinalKey()).be.exactly(null);
        });
    });
});