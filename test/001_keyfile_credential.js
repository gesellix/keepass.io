var should = require('should');
var kpio = require('../lib');
var path = require('path');

function abspath(dirPath) {
    return path.join(__dirname, 'data', dirPath);
}

describe('Instantiating a KeyfileCredential', function() {
    describe('by providing an inexistant keyfile', function() {
        it('should throw an Error', function() {
            (function() {
                new kpio.KeyfileCredential(null);
            }).should.throw();
        });
    });
    
    describe('by providing a binary file', function() {
        var keyfile;
        before(function() {
            keyfile = new kpio.KeyfileCredential(abspath('keyfile.bin'));
        });        

        it('should result in isBinary() === true', function() {
            keyfile.isBinary().should.be.exactly(true);
        });
        
        it('and calling getFinalKey() should return a valid SecureBuffer', function() {
            keyfile.getFinalKey().should.have.property('$name', 'SecureBuffer');
        });
        
        it('and calling drop() should return null when calling getFinalKey()', function() {
            keyfile.drop();
            should(keyfile.getFinalKey()).be.exactly(null);
        });
    });
    
    describe('by providing a generated keyfile', function() {
        var keyfile;
        before(function() {
            keyfile = new kpio.KeyfileCredential(abspath('example.key'));
        });
        
        it('should result in isBinary() === false', function() {
            keyfile.isBinary().should.be.exactly(false);
        });
        
        it('and calling getFinalKey() should return a valid SecureBuffer', function() {
            keyfile.getFinalKey().should.have.property('$name', 'SecureBuffer');
        });
        
        it('and calling drop() should return null when calling getFinalKey()', function() {
            keyfile.drop();
            should(keyfile.getFinalKey()).be.exactly(null);
        });
    });
});