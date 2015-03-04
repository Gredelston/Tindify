var url = require('url');
var path = require('path');
var mg_models = require('./mg_models');

// GET functions

/* Renders the homepage (/) */
var home = function(req, res) {
  res.render('home', {title: 'Tinderfy'});
};

module.exports.home = home;
