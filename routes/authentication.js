const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user');
const { forwardAuthenticated } = require('../config/authenticated');

router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('authentication/login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/authentication/login',
        failureFlash: true
    }) (req, res, next);
});

router.get('/signup', forwardAuthenticated, (req, res) => {
    res.render('authentication/signup', { title: 'Sign Up' });
});

router.post('/signup', (req, res) => {
    const url = '/authentication/signup';
    const { username, email, password, confirm_password } = req.body;

    if (username.length < 3) {
        req.flash('error_msg', 'Username must be at least 3 characters');
        res.redirect(url);

    }
    
    if (password.length < 6) {
        req.flash('error_msg', 'Password must be at least 6 characters');
        res.redirect(url);

    }
    
    if (password !== confirm_password) {
        req.flash('error_msg', 'Passwords do not match');
        res.redirect(url);

    }

    User.findOne({ username: username })
    .then((user) => {
        if (user) {
            req.flash('error_msg', 'Username already taken');
            res.redirect(url);

        }
    }).catch((error) => console.log(error));

    User.findOne({ email: email })
    .then((user) => {
        if (user) {
            req.flash('error_msg', 'Email already exists');
            res.redirect(url);

        }
    }).catch((error) => console.log(error));

    // Create user
    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            console.log(error);
        }

        bcrypt.hash(password, salt, (error, hash) => {
            if (error) {
                console.log(error);
            }

            const user = new User({
                username,
                email,
                password: hash
            });

            user.save().then(() => {
                req.flash('success_msg', 'Your account is created. You can login, now.');
                res.redirect(url);
            }).catch((error) => console.log(error));

            console.log('User created');
            console.log(user);
        })
    });
});

module.exports = router;