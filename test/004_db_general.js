var should = require('should');
var path = require('path');
var helpers = require('./000_test_helpers')
var kpio = require('../lib');

describe('Opening a database', function() {
    var databasePath, keyfilePath;
    
    before(function() {
        databasePath = path.join(__dirname, 'data', 'example.kdbx');
        keyfilePath = path.join(__dirname, 'data', 'example.key');
    });
    
    describe('by providing an inexistant database file', function() {
        it('should throw an error', function(done) {
            var db = new kpio.KeePassIO();
            db.dropAllCredentials();
            db.loadDatabase('/DOES-NOT-EXIST/ON-NORMAL-SYSTEMS')
                .on('ready', function() {
                    done(new Error('Expected an error.'))
                })
                .on('error', function(err) {
                    done();
                });
        });
    });
    
    describe('by providing invalid credentials', function() {
       it('should throw an error', function(done) {
            var db = new kpio.KeePassIO();
            db.dropAllCredentials();
            db.addCredential(new kpio.PasswordCredential('insert-coin'));
            db.loadDatabase(databasePath)
                .on('ready', function() {
                    done(new Error('Expected an error.'));
                })
                .on('error', function(err) {
                    done();
                });
       });
    });
    
    describe('by providing valid credentials', function() {
        it('should not throw any errors', function(done) {
            var db = new kpio.KeePassIO();
            db.dropAllCredentials();
            db.addCredential(new kpio.PasswordCredential('nebuchadnezzar'));
            db.addCredential(new kpio.KeyfileCredential(keyfilePath));
            db.loadDatabase(databasePath)
                .on('ready', done)
                .on('error', done);
        });
    })
});