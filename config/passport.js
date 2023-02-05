const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email })
            .then((user) => {
                if (!user) {
                    return done(null, false, { message: 'Invalid email' });
                }

                bcrypt.compare(password, user.password, (error, match) => {
                    if (error) throw error;

                    if (match) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                });
            })
            .catch((error) => console.log(error));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(null, user);
        });
    });
};