const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const { mongodb_uri, port, session_secret } = require('./config/keys');
const homeRouter = require('./routes/home');
const authenticationRouter = require('./routes/authentication');
require('./config/passport')(passport);

// Init app
const app = express();

// Connect mongondb
mongoose.set('strictQuery', false)
    .connect(mongodb_uri)
        .then(() => console.log('MongonDB connected'))
        .catch((err) => console.log(err));

// EJS 
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes
app.use('/', homeRouter);
app.use('/authentication', authenticationRouter);

const PORT = process.env.PORT || port;
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));