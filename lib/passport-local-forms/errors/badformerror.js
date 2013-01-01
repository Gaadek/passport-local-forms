/**
 * `BadFormError` error.
 *
 * @api public
 */
function BadFormError(message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'BadFormError';
  this.message = message || null;
}

/**
 * Inherit from `Error`.
 */
BadFormError.prototype.__proto__ = Error.prototype;


/**
 * Expose `BadFormError`.
 */
module.exports = BadFormError;
