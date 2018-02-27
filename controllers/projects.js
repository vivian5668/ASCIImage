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

//**** need more work this section below
router.get('/', function(req, res) {
	db.project.findAll().then(function(projects) {
			res.render('/projects/index', {projects: data});
	});
})

//get the form for new project
router.get('/new', function(req, res) {
	res.render('projects/new', {img, cloudinary});
});

//upload imaage to cloudinary
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
			res.redirect('/projects/' + project.id);
		});
	});
});

//sending image to FireStack to get ASCII image back
router.get('/:id', function(req, res) {
	var imgUrl = cloudinary_url;
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

		 	db.project.update({
		 		ascii_url: dataObj
			 	}, {
			    where: {
			     id: req.params.id 
			 	}
			  }).then(function(project) {
			  	console.log('project.ascii_url: ' + project.ascii_url);
		 		res.render('projects/show', {project: project, imgUrl: imgUrl}) //.Search b/c dataObj structure data in search property
		 	})
		 }
	  })
});


//need more work this section below
//Get edit form
router.get('/:id/edit', function(req, res) {
	db.project.findById(req.params.id).then(function(project) {
		// console.log(project);
		res.render('projects/edit', {project : project.dataValues});
	});
})

//edit project details
router.put('/:id', function(req, res) {
	db.project.update({
		name: req.body.name
	}, {
		where: {id: req.params.id}
	}).then(function(project) {
		res.send('success');
	}).catch(function(err) {
		console.log('ERR', err);
		res.send('sad');
	})
})

//delete a project
router.delete('/:id/destroy', function(req, res) {
	db.project.findOne({
		where: {id: req.params.id},
		include: [db.post]
	}).then(function(project) {
			project.removePost(p); //removes the relationships in the join table
			
		})
}) //end of router.delete

module.exports = router;
