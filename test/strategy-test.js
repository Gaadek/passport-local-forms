var vows = require('vows');
var assert = require('assert');
var util = require('util');
var forms = require('forms');
var fields = forms.fields;
var LocalStrategy = require('passport-local-forms/strategy');
var BadFormError = require('passport-local-forms/errors/badformerror');
var EmptyFormError = require('passport-local-forms/errors/emptyformerror');

var loginForm = forms.create({
  username: fields.string({ required: true })
, password: fields.password({ required: true })
});

vows.describe('LocalStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new LocalStrategy({ form: 'not used', formError: 'not used' }, function(){});
    },
    
    'should be named session': function (strategy) {
      assert.equal(strategy.name, 'local-forms');
    },
  },

  'strategy constructed without a verify callback': {
    'should throw an error': function (strategy) {
      assert.throws(function() { new LocalStrategy() });
    },
  },

  'strategy constructed without a form option': {
    'should throw an error': function (strategy) {
      assert.throws(function() { new LocalStrategy({}, function() {})});
    },
  },

  'strategy constructed without a formError option': {
    'should throw an error': function (strategy) {
      assert.throws(function() { new LocalStrategy({ form: 'not used' }, function() {})});
    },
  },

  'strategy handling a request': {
    topic: function() {
      var strategy = new LocalStrategy({ form: loginForm, formError: 'not used' }, function(){});
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }

        strategy._verify = function(form, done) {
          done(null, { username: form.data.username, password: form.data.password });
        }

        req.username = 'johndoe';
        req.password = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.username, 'johndoe');
        assert.equal(user.password, 'secret');
      },
    },
  },

  'strategy handling a request with req argument to callback': {
    topic: function() {
      var strategy = new LocalStrategy({ form: loginForm, formError: 'not used' }, function(){});
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(null, user);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }

        strategy._passReqToCallback = true;

        strategy._verify = function(req, form, done) {
          done(null, { foo: req.foo, username: form.data.username, password: form.data.password });
        }

        req.username = 'johndoe';
        req.password = 'secret';
        req.foo = 'bar';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.username, 'johndoe');
        assert.equal(user.password, 'secret');
      },
      'should have request details' : function(err, user) {
        assert.equal(user.foo, 'bar');
      },
    },
  },

  'strategy handling a request with additional info': {
    topic: function() {
      var strategy = new LocalStrategy({ form: loginForm, formError: 'not used' }, function(){});
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user, info) {
          self.callback(null, user, info);
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }

        strategy._verify = function(form, done) {
          done(null, { username: form.data.username, password: form.data.password }, { foo: 'bar' });
        }

        req.username = 'johndoe';
        req.password = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not generate an error' : function(err, user) {
        assert.isNull(err);
      },
      'should authenticate' : function(err, user) {
        assert.equal(user.username, 'johndoe');
        assert.equal(user.password, 'secret');
      },
      'should pass additional info' : function(err, user, info) {
        assert.equal(info.foo, 'bar');
      },
    },
  },

  'strategy handling a request that is not verified': {
    topic: function() {
      var strategy = new LocalStrategy({ form: loginForm, formError: 'not used' }, function(){});
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback();
        }

        strategy._verify = function(form, done) {
          done(null, false);
        }

        req.username = 'johndoe';
        req.password = 'idontknow';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should fail authentication' : function(err, user) {
        // fail action was called, resulting in test callback
        assert.isNull(err);
      },
    },
  },

  'strategy handling a request that is not verified with additional info': {
    topic: function() {
      var strategy = new LocalStrategy({ form: loginForm, formError: 'not used' }, function(){});
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function(info) {
          self.callback(null, info);
        }

        strategy._verify = function(form, done) {
          done(null, false, { foo: 'bar' });
        }

        req.username = 'johndoe';
        req.password = 'idontknow';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should fail authentication' : function(err, user) {
        // fail action was called, resulting in test callback
        assert.isNull(err);
      },
      'should pass additional info' : function(err, info) {
        assert.equal(info.foo, 'bar');
      },
    },
  },

  'strategy handling a request that encounters an error during verification': {
    topic: function() {
      var strategy = new LocalStrategy({ form: loginForm, formError: 'not used' }, function(){});
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function(err) {
          self.callback(null, err);
        }

        strategy._verify = function(form, done) {
          done(new Error('something-went-wrong'));
        }

        req.username = 'johndoe';
        req.password = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not call success or fail' : function(err, e) {
        assert.isNull(err);
      },
      'should call error' : function(err, e) {
        assert.instanceOf(e, Error);
      },
    },
  },

  'strategy handling a request with an empty form error': {
    topic: function() {
      var strategy = new LocalStrategy({ form: loginForm, formError: 'delayed set' }, function(){});
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function(err) {
          self.callback(new Error('should-not-be-called'));
        }

        strategy._verify = function(form, done) {
          done(new Error('should-not-be-called'));
        }

        strategy._formError = function(err, req, form) {
          self.callback(null, err, form);
        }

        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not call success or fail' : function(err, e, form) {
        assert.isNull(err);
      },
      'should call error' : function(err, e, form) {
        assert.instanceOf(e, EmptyFormError);
      },
      'should provide form' : function(err, e, form) {
        assert.isNotNull(form);
      }
    },
  },

  'strategy handling a request with a bad form error': {
    topic: function() {
      var strategy = new LocalStrategy({ form: loginForm, formError: 'delayed set' }, function(){});
      return strategy;
    },

    'after augmenting with actions': {
      topic: function(strategy) {
        var self = this;
        var req = {};
        strategy.success = function(user) {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.fail = function() {
          self.callback(new Error('should-not-be-called'));
        }
        strategy.error = function(err) {
          self.callback(new Error('should-not-be-called'));
        }

        strategy._verify = function(form, done) {
          done(new Error('should-not-be-called'));
        }

        strategy._formError = function(err, req, form) {
          self.callback(null, err, form);
        }

        req.password = 'secret';
        process.nextTick(function () {
          strategy.authenticate(req);
        });
      },

      'should not call success or fail' : function(err, e, form) {
        assert.isNull(err);
      },
      'should call error' : function(err, e, form) {
        assert.instanceOf(e, BadFormError);
      },
      'should provide form' : function(err, e, form) {
        assert.isNotNull(form);
      }
    },
  },

}).export(module);
