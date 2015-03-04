var url = require('url');
var path = require('path');
var mg_models = require('./mg_models');

// GET functions
var routes = {};

/* Renders the homepage (/) */
routes.home = function(req, res) {
  res.render('home', {title: 'Tindify'});
}

routes.hello = function(req, res) {
  res.render('hello', {title: 'Logged in'});
}

module.exports = routes;
