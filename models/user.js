var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var moment = require('moment');

mongoose.connect('mongodb://localhost:27017/keepmeup', { useMongoClient: true });
var db = mongoose.connection;

var UserSchema = mongoose.Schema({
  username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
  },
  dob: {
    type: String
  }
});
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });3
	});
}
module.exports.updateUser = function(query,update, callback){
	User.update(query, update, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
