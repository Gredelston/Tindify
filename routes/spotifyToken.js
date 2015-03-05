var http = require('http');
var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').SpotifyStrategy;

var client_id = process.env.SPOTIFY_KEY;
var client_secret = process.env.SPOTIFY_SECRET;

passport.use(new SpotifyStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:3000/authed"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

module.exports = passport.authenticate;