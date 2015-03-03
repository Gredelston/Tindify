// Connecting to MongoDB
var mongoose = require('mongoose');

var mongoURI = process.env.MONGOURI || "mongodb://twoteuser:twote@ds039411.mongolab.com:39411/olinjs";
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Successfully opened mongo database: ', mongoURI);
});

// Defining schemas
var userSchema = mongoose.Schema({
  username: String
});

var twoteSchema = mongoose.Schema({
  user: String,
  text: String
});

// Defining models
var User = mongoose.model('User', userSchema);
var Twote = mongoose.model('Twote', twoteSchema);

// Exports
module.exports.User = User;
module.exports.Twote = Twote;