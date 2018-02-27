require('dotenv').config();

var express = require('express');
var db = require('../models'); // db is just a variable we create, getting all the models we created
var passport = require('../config/ppConfig');
var router = express.Router();
var request = require('request');

var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var path = require('path');
var fs = require('fs');

var cloudinary = require('cloudinary');

var img = [];

var cloudinary_url;

//upload imaage to cloudinary
router.get('/new', function(req, res) {
	res.render('image/new', {img, cloudinary});
});


router.post('/new', upload.single("myFile"), function(req, res) {
	cloudinary.uploader.upload(req.file.path, function(result) {
		// res.send(result);
		img.push(result.public_id);

		cloudinary_url = result.url;

		db.project.create({
			userId: req.user.id, //to get the userId who signed in currently
			project_name: req.body.project_name,
			description: req.body.description,
			cloudinary_url: cloudinary_url,
			ascii_url: '#'
		}).then(function(project) {
			//noew delete all the files in upload folder b/c they are uploaded already
			fs.readdir('./uploads', function(err, items) {
				items.forEach(function(file) {
					fs.unlink('./uploads/' + file); //linux --- unlink == delete
				});
			});
			res.redirect('/image/' + project.id);
		});
	});
});

//sending image to FireStack to get ASCII image back
router.get('/:id', function(req, res) {
	var imgUrl = cloudinary_url;
	db.project.find({
	    where: { id: req.params.id },
	    include: [db.user]
	  }).then(function(){
			request({
				url: 'https://process.filestackapi.com/'
				+ process.env.FIRE_STACK_KEY 
				+ '/ascii=background:black,colored:true,size:40/' 
				+ imgUrl
			}, function(error, response, body) {
				// console.log(error, body);
				 if (!error && response.statusCode === 200) {
				 	var dataObj = body;
				 	// console.log(body);
				 	res.render('image/imageResult', {imageResult: dataObj, imgUrl: imgUrl}) //.Search b/c dataObj structure data in search property
				 }
			  })
	})
});

module.exports = router;
