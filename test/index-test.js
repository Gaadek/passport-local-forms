var vows = require('vows');
var assert = require('assert');
var util = require('util');
var local = require('passport-local-forms');


vows.describe('passport-local-forms').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(local.version);
    },
    
    'should export BadFormError': function (x) {
      assert.isFunction(local.BadFormError);
    },

    'should export EmptyFormError': function (x) {
      assert.isFunction(local.BadFormError);
    },
  },
  
}).export(module);
