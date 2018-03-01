

$(document).ready(function(){
	//delete projects ajax
	$('.delete-link').on('click', function(e) {
		console.log('in delete route');
		e.preventDefault();
		var deleteUrl = $(this).attr('href');
		$.ajax({
			method: 'delete',
			url: deleteUrl
		}).done(function(data) {
			window.location = '/projects';
		})
	})

	
	//update project information ajax
	$('#put-form').on('submit', function (e) {
			console.log('form was submitted');
			e.preventDefault();
			var editForm = $(this);
			var editUrl = editForm.attr('action');
			var editData = editForm.serialize(); //we won't post to back, will put 
			$.ajax({
				method: 'PUT',
				url: editUrl,
				data: editData
			}).done(function(data) {
				window.location = editForm.attr('action');
				//update the client side UI

			})
		})

	//materilize jQuery functions initiation
	$('.tooltipped').tooltip({delay: 50});
	$(".button-collapse").sideNav();
	$('.slider').slider({
	 	// height: 300,
	 	// width: 400
	 });
})