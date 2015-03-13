/**
 * Called when you click left to skip a song.
 * Will make an AJAX call to remove this song from the queue,
 * and then reload this page to start playing the new song.
 */
var skipSong = function() {
	console.log("Skipping");
	$.post('/skipSong')
		.done(function(data, status) {
			console.log(data);
			if (data=="0") {
				window.location.replace('/findSongs');
			} else {
				window.location.replace('/playSong');
			}
		});
}

/**
 * Called when you click right to add a song to your playlist.
 * Will make an AJAX call to add the song,
 * and then call skipSong() to move to the next track.
 */
var addSong = function() {
	console.log("Adding");
	$.post('/addSong')
		.done(skipSong);
}

$(document).ready(function() {
	var leftPressed = false;
	var rightPressed = false;

	// When you click the buttons, do the things.
	$("#skipSong").on('click',skipSong);
	$("#addSong").on('click',addSong);

	// Keypress listeners for LEFT/RIGHT swiping.
	// Borrowed from stackoverflow:
	// http://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
	$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        if (!leftPressed) {
        		leftPressed = true;
	        	skipSong();
	        }
        	break;

        case 39: // right
        	if (!rightPressed) {
        		rightPressed = true;
        		addSong();
        	}
        	break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
	});

	// Keep track of whether each key has been pressed
	// so that you can't hold down one key to skip through everything.
	// (If you hold it down past the refresh it will still skip,
	//  but that's slow enough that I don't care.)
	$(document).keyup(function(e) {
  switch(e.which) {
      case 37: // left
      	leftPressed = false;
      	break;

      case 39: // right
      	rightPressed = false;
      	break;

      default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
	});
});