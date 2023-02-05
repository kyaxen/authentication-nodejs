module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        }
        req.flash('error_msg', 'Please login first');
        res.redirect('/authentication/login');
    },

    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            next();
        }
        res.redirect('/home');
    }
};