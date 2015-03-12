var url = require('url');
var path = require('path');
var querystring = require('querystring');
var https = require('https');
var request = require('request');

// Play audio
var lame = require('lame');
var Speaker = require('speaker');

// Spotify OAuth
var redirect_uri = 'http://localhost:3000/authed'; 
var stateKey = 'spotify_auth_state';
var client_id = require('./spotifyAuthKeys').client_id;
var mg_models = require('./mg_models');

var routes = {};

/* Renders the homepage (/) */
routes.home = function(req, res) {
  res.render('home', {title: 'Tindify'});
}

routes.authed = function(req, res) {
  res.render('authed', {title: 'logged in'});
}

routes.getUser = function(req, res) {
  console.log("GET USER GET USER GET USER");
  console.log(req.user.token)
  var options = {
    url: "https://api.spotify.com/v1/users/"+req.user.id+"/playlists",
    headers: {
      Authorization: "Bearer " + req.user.token
    }
  }
  request.get(options, function (error, response, body) {
      console.log("BODY: " + body)
    });
  res.render('home', {title: 'LOGGED IN'});
}

routes.playSong = function(req, res) {
// necessary code to play music with lame,
// needs to be wrapped in function calling
// the Spotify API

// Don't think I need this options stuff
  var options = {
    url: "https://api.spotify.com/v1/tracks/"+"32OlwWuMpZ6b0aN2RZOeMS"
    // url: "https://api.spotify.com/v1/tracks/"+{id}
  }
  request.get(function (err, track) {
    if (err) throw err;
    console.log('playing song');
    track.play()
        .pipe(new lame.Decoder())
        .pipe(new Speaker());
  });
}

routes.login = function(req, res) {

  // var client_id = process.env.SPOTIFY_KEY;
  // var client_secret = process.env.SPOTIFY_SECRET;
  // var redirect_uri = 'http://localhost:3000/authed';
  // var stateKey = 'spotify_auth_state';
  // var state = generateRandomString(16);
  // res.cookie(stateKey, state);

  // // your application requests authorization
  // var scope = 'user-read-private user-read-email';
  // res.redirect('https://accounts.spotify.com/authorize?' +
  //   querystring.stringify({
  //     response_type: 'code',
  //     client_id: client_id,
  //     scope: scope,
  //     redirect_uri: redirect_uri,
  //     state: state
  //   }));
};

module.exports = routes;
