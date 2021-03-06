var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');
var User = require('../models/user');

// route to create/ render register page ejs
router.get('/register', function(req, res){
	res.render('pages/register', {errors: false});
});
//was the previous route creation for setting
// router.get('/settings', function(req, res){
// 	res.render('pages/settings');
// });
// route creation for settings page
router.get('/settings', function(req, res) {
    // mongoose operations are asynchronous, so the find will take a little time
		//this isn't really needed but it was to just get the data from the database
    User.find({}, function(err, data) {
			// console.log(data);
        // All the data is in an array of objects, not a single object
				user = req.user;
        res.render('pages/settings', {user : user});
    });
});
//Privacy
router.get('/privacy', function(req, res){
	res.render('pages/privacy');
});

// Login
router.get('/login', function(req, res){
	res.render('pages/login');
});

router.post('/settings', function (req, res){
	var query = {
		username: req.user.username
	}
	var update = {
		name: req.body.name,
			email : req.body.email,
			username : req.body.username,
			dob : req.body.dob,
	}
	User.updateUser(query,update, function (err, user) {
		// User.update(currentUser, name, function(err){
			if(err) throw err;
			console.log(update);
			console.log(user);
			res.render('pages/settings',{user: update})
	});
});

// Post method to send the data from the form to screen
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	// using momentjs to format the data correctly
	var dob = moment(req.body.dob).format('DD/MM/YYYY');

	console.log(JSON.stringify(req.body));
	// request fundtions for vaildation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('dob', 'Date of birth is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		console.log(errors)
		res.render('pages/register',{errors:errors});
	} else {
		console.log('user made!')
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			dob: dob
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});
		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}
   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.getUserById(id, function(err, user) {
	    done(err, user);
	  });
	});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash:true}),
  function(req, res) {
    res.redirect('/');
  });

	router.get('/logout', function(req, res){
		req.logout();

		req.flash('success_msg', 'You are logged out');

		res.redirect('/login');
	});



module.exports = router;
