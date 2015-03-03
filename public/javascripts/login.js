$(document).ready(function() {

  $('#login-form').submit(function(event) {
    event.preventDefault();
    var user = $('#login-text')[0].value.trim();
    $.post('/loginSubmit', {user: user})
      .done(function(data, status) {
      	console.log("Redirecting to /...")
        window.location.href = "/";
      });
  });
  
})	