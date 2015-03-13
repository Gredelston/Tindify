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
  console.log(getCategories(req));
  res.render('home', {title: 'LOGGED IN'});
}

function getCategories(req) {
  var options = {
    url: 'https://api.spotify.com/v1/browse/categories',
    headers: {
      Authorization: 'Bearer ' + req.user.token
    }
  }
  request.get(options, function (error, response, body) {
    console.log(body.categories);
    var categories = body.categories.items;
    return categories.map(function(c) {return c.id});
  });
}

routes.playSong = function(req, res) {
// necessary code to play music with lame,
// needs to be wrapped in function calling
// the Spotify API

// Don't think I need this options stuff
  var options = {
    // url: "https://api.spotify.com/v1/tracks/"+{id}
  }
  var uri = 'spotify:track:32OlwWuMpZ6b0aN2RZOeMS';
  request.get(uri, function (err, track) {
    if (err) throw err;
    console.log('playing song');
    track.play()
        .pipe(new lame.Decoder())
        .pipe(new Speaker());
  });
}
// Need to look into this, found docs at
// https://github.com/TooTallNate/node-spotify-web

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
