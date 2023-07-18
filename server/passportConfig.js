const connection = require('./db');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: 'TUPCID',
        passwordField: 'PASSWORD',
      },
      (username, password, done) => {
        const query = 'SELECT * FROM login_register2 WHERE TUPCID = ?';
        connection.query(query, [username], (err, result) => {
          if (err) {
            throw err;
          }
          if (result.length === 0) {
            return done(null, false);
          }
          const user = result[0];
          bcrypt.compare(password, user.PASSWORD, (err, response) => {
            if (err) {
              throw err;
            }
            if (response === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.TUPCID);
  });

  passport.deserializeUser((TUPCID, done) => {
    const query = 'SELECT TUPCID, USERNAME, PASSWORD, ROLES FROM login_register2 WHERE TUPCID = ?';
    connection.query(query, [TUPCID], (err, result) => {
      if (err) {
        throw err;
      }
      if (!result || result.length === 0) {
        return done(new Error('Failed to deserialize user'));
      }
      const user = {
        TUPCID: result[0].TUPCID,
        USERNAME: result[0].USERNAME,
        PASSWORD: result[0].PASSWORD,
        ROLES: result[0].ROLES,
      };
      done(null, user);
    });
  });
};
