const router = require('express').Router();
const { forwardAuthenticated, ensureAuthenticated } = require('../config/authenticated');

router.get('/', forwardAuthenticated, (req, res) => {
    res.redirect('/authentication/login');
});

router.get('/home', ensureAuthenticated, (req, res) => {
    res.render('home', { title: 'Home', user: req.user.username });
});

module.exports = router;