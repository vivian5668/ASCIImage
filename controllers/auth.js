var express = require('express');
var db = require('../models'); // db is just a variable we create, getting all the models we created
var passport = require('../config/ppConfig');
var router = express.Router();

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
	db.user.findOrCreate({
		where: {email: req.body.email},
		defaults: {
			name: req.body.name,
			password: req.body.password
		} //spread = then except that it takes 2 parameters
	}).spread(function(user, created) {
		if (created) {
			//new user created
			console.log('user created')
			passport.authenticate('local', {
				successRedirect: '/',
				successFlash: 'account created and logged in'
			})(req, res); //if we successfullly authenticate, successRedirect
		} else {
			//this means email already exists in db
			console.log('email already existed');
			req.flash('error', 'email already exists');
			res.redirect('/auth/signup');
		}
	}).catch(function(error) {
		console.log('error occurred: ' + error.message);
		req.flash('error', error.message)
		res.redirect('/auth/signup');
	})
})

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	successFlash: 'You have logged in!!',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid username or password'
}))

//remove the user from the session
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Logged out');
	res.redirect('/')
})

module.exports = router;






