/**
 * Module dependencies.
 */
var Strategy = require('./strategy')
  , BadFormError = require('./errors/badformerror')
  , EmptyFormError = require('./errors/emptyformerror');


/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.Strategy = Strategy;

exports.BadFormError = BadFormError;

exports.EmptyFormError = EmptyFormError;
