var url = require('url');
var path = require('path');
var mg_models = require('./mg_models');

// GET functions
var routes = {};

/* Renders the homepage (/) */
routes.home = function(req, res) {
  res.render('home', {title: 'Tindify'});
}

routes.authed = function(req, res) {
  res.render('authed', {title: 'logged in'});
}

module.exports = routes;
