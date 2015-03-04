// Connecting to MongoDB
var mongoose = require('mongoose');

var mongoURI = process.env.MONGOURI || "mongodb://tinderfyuser:tinderfy@ds039411.mongolab.com:39411/olinjs";
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Successfully opened mongo database: ', mongoURI);
});

// Defining schemas
/**
 * var userSchema = mongoose.Schema({
 * username: String
 * });
 */

// Defining models
/**
var User = mongoose.model('User', userSchema);
 */

// Exports
/**
 * module.exports.User = User;
 */
