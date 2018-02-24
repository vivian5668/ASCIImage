var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var db = require('../models');

//passport serialize objects to make them easy to store
//converting the user to an identifier.
passport.serializeUser(function(user, cb) { //cb--callback
	cb(null, user.id);
})

//Passport "deserializes" objects by taking the user's serialization id
//and looking it up in the database
passport.deserializeUser(function(id, cb) {
	db.user.findById(id).then(function(user) {
		cb(null, user);
	}).catch(cb);
});

//set up the local auth strategy 
passport.use(new localStrategy({
	usernameField: 'email',
	passwordField: 'password'
},function(email, password, cb){
	db.user.find({
		where: {email: email}
	}).then(function(user) {
		if (!user || !user.validPassword(password)) {
			cb(null, false);
		} else {
			cb(null, user);
		}
	}).catch(cb); //cb is used in passport, basically tells you to go to next thing, ignore the error
}))


module.exports = passport;