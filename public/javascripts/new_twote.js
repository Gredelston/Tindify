var deleteTwote = function() {
	var liTwote = $(this).parents(".twote")[0];
	
	var id = $(liTwote).attr('id');
	
	$.ajax({
		url: '/deleteTwote',
		data: {id: id},
		type: "DELETE",
		success: liTwote.remove()
	});	
}


$(document).ready(function() {
	$(".delete-button").click(deleteTwote);

	$.get('loggedIn').done(function(user, status) {

		$('#new-twote').submit(function(event) {
	    event.preventDefault();
	    var text = $('#new-text')[0].value;

	    $.post('/newTwote', {user: user, text: text})
	      .done(function(data, status) {

	        $('#twotes-list').prepend(data);

	        var deleteButton = $('.delete-button').first()
	        deleteButton.click(deleteTwote);
	      });
	  });
	});
});