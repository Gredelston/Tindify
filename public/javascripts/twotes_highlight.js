var highlight = function (elem) {
  elem.css("border","#e85242");
  elem.css("border-width","3px");
  elem.css("border-style","solid")
}

var unhighlight = function (elem) {
  elem.css("border-right-color", "#7f8c8d");
  elem.css("border-bottom-color", "#7f8c8d");
  elem.css("border-top-color", "#bdc3c7");
  elem.css("border-left-color", "#bdc3c7");
  elem.css("border-width", "1px");
}

var toggle_highlight = function(elem) {
  highlighted = elem.attr("highlighted");
  if ( highlighted === "true" ) {
    unhighlight(elem);
  } else if ( highlighted === "false") {
    highlight(elem);
  } else {
    console.log("ERROR: " + elem + " has \"highlighted\" attr " + highlighted);
  }
}

$(document).ready(function() {
  $('.user').click(function() {
    var username = $(this).attr('username');
    toggle_highlight($(this))
    
    var twote_user;
    $(".twote").each( function(index, twote) {
      twote_user = twote.attr("username");
      if (twote_user === username) {
        toggle_highlight(twote);
      }
    });
  });
});