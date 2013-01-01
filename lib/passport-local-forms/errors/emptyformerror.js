/**
 * `EmptyFormError` error.
 *
 * @api public
 */
function EmptyFormError(message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'EmptyFormError';
  this.message = message || null;
}

/**
 * Inherit from `Error`.
 */
EmptyFormError.prototype.__proto__ = Error.prototype;


/**
 * Expose `EmptyFormError`.
 */
module.exports = EmptyFormError;
