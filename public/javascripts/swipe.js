var skipSong = function() {
	console.log("Skipping");
	$.post('/skipSong')
		.done(function() {window.location.replace('/playSong')});
}

var addSong = function() {
	console.log("Adding");
	$.post('/addSong')
		.done(skipSong);
}

$(document).ready(function() {
	$("#skipSong").on('click',skipSong);
	$("#addSong").on('click',addSong);
});