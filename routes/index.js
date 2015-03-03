var url = require('url');
var path = require('path');
var mg_models = require('./mg_models');

var User = mg_models.User;
var Twote = mg_models.Twote;

// GET functions

/* Renders the homepage (/) */
var home = function(req, res) {
  User.find({}, function(user_err, users) {
    if (user_err) {
      console.log("Error finding users", user_err);
      return;
    }

    Twote.find({})
      .sort({'_id':'desc'}  )
      .exec(function(twote_err, twotes) {
      if (twote_err) {
        console.log("Error loading twotes", twote_err)
      }
      var sessionUser = req.session.user;
      console.log(sessionUser);
      res.render('home', {users: users, twotes: twotes, sessionUser: sessionUser});
    });
  });
};

/* Renders /login */
var login = function(req, res) {
  res.render('login');
};

/* Sends true iff a user is logged in;
 * i.e., iff the "user" cookie is not ""
 */
var loggedIn = function(req, res) {
  var user = req.session.user;
  if (user) {
    res.send(user.trim());
  } else {
    res.send(req.session.user);
  }
};

/* Called from /login
 * when the client has typed in their username
 * and presses the submit ("Log in") button.
 * If the user doesn't exist yet, adds them to the User db.
 * Modifies the "user" cookie. They will be redirected to /.
 * Returned data is the username.
 */
var loginSubmit = function(req, res) {
  // Modify cookie
  var user = req.body.user;
  req.session.user = user;

  // Add to the db
  User.where({username: user})
    .findOne(function (err, doc) {
      if (doc) {
        console.log(doc);
        return;
      } else {
        new User({username: user})
          .save(function (err) {
            if (err) {
              console.log("Problem saving user ", err);
            }
            // Return username as data
            res.end(user)
          })
      }
    });

  res.end(user);
};

/* Called from /
 * when the client, logged in, presses "Log out".
 * Removes the "user" cookie. They will be redirected to /.
 */
var logoutSubmit = function(req, res) {
  req.session.user = "";
  res.end();
};

var newTwote = function(req, res) {
  // Pull data
  var user = req.body.user;
  var text = req.body.text;

  // Create new twote
  var twote = new Twote({user: user, text: text});
  twote.save(function (err, doc) {
    console.log(doc);
    if (err) {
      console.log("Problem.saving twote ", err);
    }
  });
  
  // Render into HTML the new twote chunk,
  // and send it back as a response.
  res.render('partials/twotes_chunk', {twotes: [twote], layout: false, sessionUser: req.session.user});
};

var deleteTwote = function(req, res) {
  var id = req.body.id;
  console.log("ID: " + id)
  Twote.find({"_id": id}, function(err, twotes) {
    var twote = twotes[0];
    twote.remove();
    res.end()
  })
}

module.exports.home = home;
module.exports.login = login;
module.exports.loggedIn = loggedIn;
module.exports.loginSubmit = loginSubmit;
module.exports.logoutSubmit = logoutSubmit;
module.exports.newTwote = newTwote;
module.exports.deleteTwote = deleteTwote;