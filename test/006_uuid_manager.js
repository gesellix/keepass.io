var should = require('should');
var helpers = require('./000_test_helpers')
var UuidManager = require('../lib/versions/common/UuidManager');

var UNUSED_TEST_UUID = 'SO2nkSMoNk+bH9FglLF79Q==';
var USED_TEST_UUID = 'NmWWy41MG0WYp6yIGQVUvA==';
var DELETED_TEST_UUID = 'c6JcDj6P7k+QOQJPfiSsWw==';

describe('Initializing the UuidManager', function() {
    var manager;
    
    before(function() {
        manager = new UuidManager();
    });
    
    describe('and marking an UUID as unused', function() {
        before(function() {
            manager.markUnused(UNUSED_TEST_UUID);
        });
        
        it('#isUnique() = true', function() {
            manager.isUnique(UNUSED_TEST_UUID).should.be.ok;
        });
        it('#isUsed() = false', function() {
            manager.isUsed(UNUSED_TEST_UUID).should.not.be.ok;
        });
        it('#isDeleted() = false', function() {
            manager.isDeleted(UNUSED_TEST_UUID).should.not.be.ok;
        });
    });
    
    describe('and marking an UUID as used', function() {
        before(function() {
            manager.markUsed(USED_TEST_UUID);
        });
        
        it('#isUnique() = false', function() {
            manager.isUnique(USED_TEST_UUID).should.not.be.ok;
        });
        it('#isUsed() = true', function() {
            manager.isUsed(USED_TEST_UUID).should.be.ok;
        });
        it('#isDeleted() = false', function() {
            manager.isDeleted(USED_TEST_UUID).should.not.be.ok;
        });
    });
    
    describe('and marking an UUID as deleted', function() {
        before(function() {
            manager.markDeleted(DELETED_TEST_UUID);
        });
        
        it('#isUnique() = false', function() {
            manager.isUnique(DELETED_TEST_UUID).should.not.be.ok;
        });
        it('#isUsed() = false', function() {
            manager.isUsed(DELETED_TEST_UUID).should.not.be.ok;
        });
        it('#isDeleted() = true', function() {
            manager.isDeleted(DELETED_TEST_UUID).should.be.ok;
        });
    });
});