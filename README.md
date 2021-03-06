# Passport-Local-Forms

[Passport](http://passportjs.org/) strategy for authenticating with a username
and password utilizing [Forms](https://github.com/caolan/forms).

This module lets you authenticate using a form in your Node.js applications.
By plugging into Passport, local forms authentication can be easily
and unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-local-forms

## Usage

#### Configure Strategy

The local forms authentication strategy authenticates users using a username
and password.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user.

    var loginForm = forms.create(
    {
      username: fields.string({ required: true })
    , password: fields.password({ required: true })
    });
    passport.use(new LocalStrategy(
      {
        form: loginForm
      , formError: function(err, req, form) {
          req.res.render('login', { loginForm: form, user: req.user, message: err.message });
        }
      }
    , function(form, done) {
        User.findOne({ username: form.data.username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.verifyPassword(form.data.password)) { return done(null, false); }
          return done(null, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'local-forms'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/login', 
      passport.authenticate('local-forms', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/adamldoyle/passport-local-forms/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/adamldoyle/passport-local-forms.png)](http://travis-ci.org/adamldoyle/passport-local-forms)

## Credits

  - [Adam Doyle](http://github.com/adamldoyle)

## License

(The MIT License)

Copyright (c) 2012 Adam Doyle

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
