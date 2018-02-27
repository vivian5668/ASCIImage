require('dotenv').config();

var flash = require('connect-flash');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var path = require('path');
var fs = require('fs');

var isLoggedIn = require('./middleware/isLoggedIn');

var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var path = require('path');

var cloudinary = require('cloudinary');

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public'))); //now ejs knows to find js, css, html in the static folder


app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(session({
	secret: process.env.SESSION_SECRET, //the phrase in the .env file doens't matter but just needs to be there to make it unique
	resave: false,
	saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
	//before every route, attach the flash messages and current user to res.locals
	res.locals.alerts = req.flash();
	res.locals.currentUser = req.user;
	next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/gallery', function(req, res) {
  res.render('gallery');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));
app.use('/projects', require('./controllers/projects'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
