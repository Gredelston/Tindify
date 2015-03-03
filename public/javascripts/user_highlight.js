$(document).ready(function() {
	$.get('loggedIn').done(function(user, status) {
		var userBoxString = '.user:contains("'+user+'")'
		var userBox = $(userBoxString)
		
		userBox.each(function(i) {
			if ($(this).text().trim() === user) {
				$(this).css('background-color', '#2ecc71')
			}
		});

	});
});