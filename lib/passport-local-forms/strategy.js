/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  , BadFormError = require('./errors/badformerror')
  , EmptyFormError = require('./errors/emptyformerror');


/**
 * `Strategy` constructor.
 *
 * The local form authentication strategy authenticates requests based on the
 * credentials submitted through a form object.
 *
 * Applications must supply a `verify` callback which accepts a `form` object
 *  containing credentials, and then calls the `done` callback supplying a
 *  `user`, which should be set to `false` if the credentials are not valid.
 *  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *   - `form`               contains the form definition according to caolan's Node.js form's project
 *   - `form_error`         callback for handling errors during form validation. Should accept the
 *                          error, the request, and the form. The passed form object will contain the errors.
 *
 * Examples:
 *     var loginForm = forms.create({
 *         email: fields.email({ required: true })
 *       , password: fields.password({ required: true })
 *     });
 *     passport.use(new LocalStrategy({
 *         form: loginForm
 *       , formError: function (err, req, form) {
 *           req.res.render('login'), { title: 'Error', loginForm: form });
 *         }
 *       }
 *     , function(form, done) {
 *         User.findOne({ username: form.data.username, password: form.data.password }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  if (!verify) { throw new Error('local forms authentication strategy requires a verify function'); }
  if (!options.form) { throw new Error('local forms authentication strategy requires a form option'); }
  if (!options.formError) { throw new Error('local forms authentication strategy requires a formError callback option'); }

  passport.Strategy.call(this);
  this.name = 'local-forms';
  this._verify = verify;
  this._form = options.form;
  this._formError = options.formError;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form object.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};

  var self = this;

  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  self._form.handle(req, {
    success: function (form) {
      if (self._passReqToCallback) {
        self._verify(req, form, verified);
      } else {
        self._verify(form, verified);
      }
    }
  , error: function (form) {
      return self._formError(new BadFormError('Error validating form'), req, form);
    }
  , empty: function (form) {
      return self._formError(new EmptyFormError('No form data'), req, form);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
