

$(document).ready(function(){
	$('.delete-link').click(function(e) {
		e.preventDefault(); //a tags usually gives Get action
		$.ajax({
			url: $(this).attr('href'),
			method: 'DELETE'
		}).done(function(data) {
			location.reload();
	})


	// $('#edit-tag').submit(function(e) {
	// 	console.log('submit!!');
	// 	e.preventDefault(); //a tags usually gives Get action
	// 	$.ajax({
	// 		url: $(this).attr('action'),
	// 		method: 'PUT',
	// 		data: {
	// 			name: $("#name").val()
	// 		}
	// 	}).success(function(data) {
	// 		window.location.href = '/projects';
	// 	})
	// })

	//upload the ASCII image to cloudinery

	// $('#btnSave').click(function() {
	// cloudinary.uploader.upload(req.file.path, function(result) {
	// 	// res.send(result);
	// 	img.push(result.public_id);

	// 	cloudinary_url = result.url;

	// 	db.project.create({
	// 		userId: req.user.id, //to get the userId who signed in currently
	// 		project_name: req.body.project_name,
	// 		description: req.body.description,
	// 		cloudinary_url: cloudinary_url,
	// 		ascii_url: '#'
	// 	}).then(function(project) {
	// 		//noew delete all the files in upload folder b/c they are uploaded already
	// 		fs.readdir('./uploads', function(err, items) {
	// 			items.forEach(function(file) {
	// 				fs.unlink('./uploads/' + file); //linux --- unlink == delete
	// 			});
	// 		});
	// 		res.redirect('/projects/' + project.id);
	// 		});
	// 	});
	// });


	$(".button-collapse").sideNav();
	$('.slider').slider({
	 	// height: 300,
	 	// width: 400
	 });
})