var should = require('should');
var path = require('path');
var helpers = require('./000_test_helpers')
var kpio = require('../lib');

var PARENT_GROUP_UUID = 'Pl5s4tAbm0eiyg1aOOr0/A==';
var TEST_ENTRY_UUID = 'b7h30xv9PkGEL1Jt5SQc0A==';

describe('Opening the example database', function(){
    var api;
    
    before(function(done) {
        var databasePath = path.join(__dirname, 'data', 'example.kdbx');
        var keyfilePath = path.join(__dirname, 'data', 'example.key');
        
        var db = new kpio.KeePassIO();
        db.addCredential(new kpio.PasswordCredential('nebuchadnezzar'));
        db.addCredential(new kpio.KeyfileCredential(keyfilePath));
        db.loadDatabase(databasePath)
            .on('ready', function() {
                api = db.getApi();
                done();
            })
            .on('error', done);
    });
    
    describe('#meta()', function() {
        it('should match predefined values', function() {
            api.meta().should.have.properties({
                generator: 'KeePass',
                dbName: 'KeePassIO Development Database',
                color: '#FF0000',
                maintenanceHistoryDays: 365,
                memoryProtection: {
                    title: false,
                    username: false,
                    password: true,
                    url: false,
                    notes: false
                }
            });
        });
    });
    
    describe('#groups()', function() {
        var groups;
        
        before(function() {
            groups = api.groups(); 
        });
        
        it('should return exactly one group', function() {
            Object.keys(groups).should.have.length(1);
        });
        
        it('the metadata of the first group should match predefined values', function() {
            groups[Object.keys(groups)[0]].meta().should.have.properties({
                uuid: PARENT_GROUP_UUID,
                name: 'keepass.io',
                iconId: 49
            });
        });
    });
    
    describe('#groups(\'' + PARENT_GROUP_UUID + '\')', function() {
        var parentGroup;
        
        before(function() {
            parentGroup = api.groups(PARENT_GROUP_UUID);
        });
        
        describe('#entries()', function() {
            var entries;
            
            before(function() {
                entries = parentGroup.entries();
            });
            
            it('should return exactly two entries', function() {
                Object.keys(entries).should.have.length(2);
            });
        });
        
        describe('#entries(\'' + TEST_ENTRY_UUID + '\')', function() {
            var entry;
            
            before(function() {
                entry = parentGroup.entries(TEST_ENTRY_UUID);
            });
            
            it('the metadata should match predefined values', function() {
                entry.meta().should.have.properties({
                    uuid: TEST_ENTRY_UUID
                });
            });
            
            it('the strings should match predefined values', function() {
                entry.strings().should.have.properties({
                    'Title': 'Example Entry',
                    'UserName': 'matrix',
                    'Password': 'agentsmith',
                    'URL': '',
                    'Notes': ''
                });
            })
        });
        
        describe('#groups()', function() {
            var groups;
            
            before(function() {
                groups = parentGroup.groups();
            });
            
            it('should return exactly one group', function() {
                Object.keys(groups).should.have.length(1);
            });
            
            it('the metadata of the first group should match predefined values', function() {
                groups[Object.keys(groups)[0]].meta().should.have.properties({
                    uuid: 'WzffvM3Rw0KYfxCSjreIzg==',
                    name: 'kpio rocks',
                    iconId: 29
                });
            });
        });
    });
});