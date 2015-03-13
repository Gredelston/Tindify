var url = require('url');
var path = require('path');
var querystring = require('querystring');
var https = require('https');
var request = require('request');
var session = require('express-session');

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
  res.redirect('/findSongs');
  // res.render('home', {title: 'LOGGED IN'});
}

var randomChoice = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Finds the IDs of a bunch of tracks we care about,
// and stores them in the session under req.session.tracks
// We hates how big this function are.
routes.findSongs = function(req, res) {
  // Get a random category from the front page
  var categoriesOptions = {
    url: 'https://api.spotify.com/v1/browse/categories',
    headers: { Authorization: 'Bearer ' + req.user.token }
  };
  request.get(categoriesOptions, function (error, response, body) {
    var categories = JSON.parse(body).categories.items;
    categories = (categories.map(function(c) {return c.href}));
    var categoryURL = randomChoice(categories);
    console.log("USING CATEGORY: " + categoryURL);

    // Get a random playlist from that category
    var playlistOptions = {
      url: categoryURL+'/playlists',
      headers: { Authorization: 'Bearer ' + req.user.token }
    };
    request.get(playlistOptions, function (perror, presponse, pbody) {
      var playlists = JSON.parse(pbody).playlists.items;
      playlists = (playlists.map(function (p) {return p.href}))
      var playlistURL = randomChoice(playlists);
      console.log("USING PLAYLIST: " + playlistURL); 

      // Get the full list of tracks from that playlist
      var tracksOptions = {
        url: playlistURL+'/tracks',
        headers: { Authorization: 'Bearer ' + req.user.token }
      };
      request.get(tracksOptions, function (terror, tresponse, tbody) {
        var tracks = JSON.parse(tbody).items;
        tracks = (tracks.map(function (t) {return t.track.href}));
        req.session.tracks = tracks;
        res.redirect('/playSong');
      })
    });
  });
}

// Play the zeroeth track.
routes.playSong = function(req, res) {
  var trackOptions = {
    url: req.session.tracks[0],
    headers: { Authorization: 'Bearer ' + req.user.token }
  };
  request.get(trackOptions, function (terror, tresponse, tbody) {
    tbody = JSON.parse(tbody);
    console.log("NAME: " + tbody.name);
    res.render('playSong', {trackName: tbody.name, previewURL: tbody.preview_url});
  });
}

// routes.playSong = function(req, res) {
// // necessary code to play music with lame,
// // needs to be wrapped in function calling
// // the Spotify API

// // Don't think I need this options stuff
//   var options = {
//     // url: "https://api.spotify.com/v1/tracks/"+{id}
//   }
//   var uri = 'spotify:track:32OlwWuMpZ6b0aN2RZOeMS';
//   request.get(uri, function (err, track) {
//     if (err) throw err;
//     console.log('playing song');
//     track.play()
//         .pipe(new lame.Decoder())
//         .pipe(new Speaker());
//   });
// }
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
