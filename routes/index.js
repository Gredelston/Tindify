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

var PLAYLIST_NAME = "Tindify";

var routes = {};

/* Renders the homepage (/) */
routes.home = function(req, res) {
  res.render('home', {title: 'Tindify'});
}

routes.authed = function(req, res) {
  res.render('authed', {title: 'logged in'});
}

routes.getPlaylist = function(req, res) {
  console.log("ID: " + req.user.id);
  var uID = req.user.id;
  var playlistsOptions = {
    url: 'https://api.spotify.com/v1/users/'+uID+'/playlists',
    headers: { Authorization: 'Bearer ' + req.user.token}
  };
  request.get(playlistsOptions, function(perror, presponse, pbody) {
    pbody = JSON.parse(pbody);
    var correct = pbody.items.filter(function(p) {
      return p.name == PLAYLIST_NAME
    });
    console.log(correct);

    if (correct.length) {
      // If the playlist already exists, then log its id and redirect to the next step.
      req.session.pID = correct[0].id;
      res.redirect('/findSongs');
    } else {
      // Otherwise, create a new playlist (POST request), log its id, and redirect.
      var newPlaylistOptions = {
        url: 'https://api.spotify.com/v1/user/'+uID+'/playlists',
        headers: {
          Authorization: 'Bearer ' + req.user.token,
          "Content-Type": "application/json"
        },
        name: PLAYLIST_NAME
      };
      request.post(newPlaylistOptions, function (nerror, nresponse, nbody) {
        console.log("NBODY: " + nbody);
        req.session.pID = JSON.parse(nbody).id;
      });
      res.redirect('/findSongs')
    }
  });
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

routes.addSong = function(req, res) {
  console.log("Adding a song!");
  res.end();  
}

routes.skipSong = function(req, res) {
  console.log("Skipping a song!");
  req.session.tracks = req.session.tracks.slice(1);
  if (req.session.tracks.length != 0) {
    res.redirect('/playSong');
  }
}

routes.login = function(req, res) {};

module.exports = routes;
