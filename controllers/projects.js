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
		db.project.findAll({
			where: {
				userId: req.user.id //id of current logged-in user
			}
		}).then(function(projects) {
			if (!req.user) {
				res.render('projects/index', {currentUser: 'Login', projects: projects});
			} else {
			  	res.render('projects/index', {currentUser: req.user.dataValues.name, projects: projects});
			    }
		});
});

//get the form for new project
router.get('/new', function(req, res) {
	img = [];
	// res.render('projects/new', {img, cloudinary});
	if (!req.user) {
		res.render('projects/new', {currentUser: 'Login'});
	} else {
	  	res.render('projects/new', {currentUser: req.user.dataValues.name});
	    }
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
			console.log(project.id) //!!!!!!!!this is getting project.id coreectly
			request({
				url: 'https://process.filestackapi.com/'
				+ process.env.FIRE_STACK_KEY 
				+ '/ascii=background:black,colored:true,size:40/' 
				+ cloudinary_url
			}, function(error, response, body) {
				// console.log(error, body);
			 	if (!error && response.statusCode === 200) {
			 		var dataObj = body;
			 	
				 	db.project.update({
				 		ascii_url: dataObj
					 	}, {
					    where: {
					     id: project.id ///???how to identify the id posted
					 	}
					}).then(function(data) {
					  	console.log('i am here! line 71');
					  	var imgUrl = cloudinary_url;
					  	console.log('data is :' + data);
							res.redirect('/projects');
				 	}); // close update.then
			 	} // close if status code
		  	});  //close request

			//noew delete all the files in upload folder b/c they are uploaded already
			fs.readdir('./uploads', function(err, items) {
				items.forEach(function(file) {
					fs.unlink('./uploads/' + file); //linux --- unlink == delete
				});
			});
			// res.redirect('/projects/' + project.id);
		})
	})
});

//sending image to FireStack to get ASCII image back
router.get('/:id', function(req, res) {
	db.project.findById(req.params.id).then(function(project) {
		if (!req.user) {
			res.render('projects/show', {currentUser: 'Login', project: project});
		} else {
		  	res.render('projects/show', {currentUser: req.user.dataValues.name, project: project});
		    }
	});
});


//need more work this section below
//Get edit form
router.get('/:id/edit', function(req, res) {
	db.project.findById(req.params.id).then(function(project) {
		if (!req.user) {
			res.render('projects/edit', {currentUser: 'Login', project: project});
		} else {
		  	res.render('projects/edit', {currentUser: req.user.dataValues.name, project: project});
		    }
	});
})

//edit project details
router.put('/:id', function(req, res) {
	db.project.update({
		project_name: req.body.name,
		description: req.body.description
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
	console.log('in delete route');
	db.project.destroy({
		where: {id: req.params.id}
	}).then(function(data) {
		res.send('success');
	})
}) //end of router.delete

module.exports = router;
