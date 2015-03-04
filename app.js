var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var session = require('express-session');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var index  = require('./routes/index');

var app = express();

app.engine('.hbs', exphbs({extname: '.hbs',
  defaultLayout: 'main' }));
app.set('view engine', '.hbs');

// Spotify OAuth
var client_id = process.env.SPOTIFY_KEY;
var client_secret = process.env.SPOTIFY_SECRET;
var redirect_uri = 'http://localhost:3000/authed'; 
var stateKey = 'spotify_auth_state';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.get('/', index.home);
app.get('/authed', index.authed);
// ^^^ Need to have a check for logged in

app.get('/login', function(req, res) {

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
});

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});
