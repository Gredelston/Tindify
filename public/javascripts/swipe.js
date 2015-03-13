var skipSong = function() {
	console.log("Skipping");
	$.post('/skipSong');
}

var addSong = function() {
	console.log("Adding");
	$.post('/addSong');
}

$(document).ready(function() {
	$("#skipSong").on('click',skipSong());
	$("#addSong").on('click',addSong());
});