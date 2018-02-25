var express = require('express');
var db = require('../models'); // db is just a variable we create, getting all the models we created
var passport = require('../config/ppConfig');
var router = express.Router();
var request = require('request');


router.get('/', function(req, res) {
	var imgUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_AeqLZHbJOq-LmZ3UkJDRLv77Fo2RV-XKWiHM2xZ4MjJwx87ZzQ'
	request({
		url: 'https://process.filestackapi.com/' + 
		process.env.FIRE_STACK_KEY + '/ascii=background:black,colored:true,size:40/' + imgUrl
	}, function(error, response, body) {
		console.log(error, body);
		 if (!error && response.statusCode === 200) {
		 	var dataObj = body;
		 	console.log(body);
		 	res.render('image/imageResult', {imageResult: dataObj}) //.Search b/c dataObj structure data in search property
		 }
	})
});

module.exports = router;