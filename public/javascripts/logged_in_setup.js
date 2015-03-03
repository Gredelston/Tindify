$(document).ready(function() {

  $.get('loggedIn')
    .done(function(data, status) {
      if (data) {
        // User is logged in
        $('#loginout').append(
          '<a href="/"><button id="logout-button" type="button">Log out</button></a>');

        $('#logout-button').click(function(event) {
            event.preventDefault();
            $.post('/logoutSubmit')
              .done(function(data, status) {
                window.location.href = "/";
              });
          });
          

      } else {
        // No user
        $('#loginout').append(
          '<a href="/login"><button id="login-button" type="button">Log in</button></a>'
          );
        $('#new-text').prop('disabled',true);
        $('#new-submit').prop('disabled',true);
      }
  });
})