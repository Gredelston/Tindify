var url = require('url');
var path = require('path');
var querystring = require('querystring');

var spotifyAuthKeys = require('./spotifyAuthKeys');
var mg_models = require('./mg_models');
var spotifyCalls = require('./spotifyCalls');

// Spotify OAuth
var redirect_uri = 'http://localhost:3000/authed'; 
var stateKey = 'spotify_auth_state';

var routes = {};

/* Renders the homepage (/) */
routes.home = function(req, res) {
  res.render('home', {title: 'Tindify'});
}

routes.authed = function(req, res) {
  res.render('authed', {title: 'logged in'});
}

routes.getUser = function(req, res) {
  res.render(spotifyCalls.getUser(client_id, client_secret));
}

routes.login = function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
};

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports = routes;
