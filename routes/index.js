var express = require('express');
var router = express.Router();
var user = require('../controllers/user')
var UserTab = require('../models/user.js');
var Friend = require('../models/friendship.js');
var Message = require('../models/message');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

		//view all users
	// router.get('/users', user.list 
	// );

	router.get('/users', function(req, res) {
		UserTab.find(function(err, users) {
	  	str = "";
	  	
	  
	        var result = {
	            ranking: [],
	        }
	        result.ranking[0] = users[0];
	         var temp = 0
	        for(var i = 0; i < users.length; i++){
	        	if (users[i].email!=req.user.email)
	         		{	result.ranking[temp] = users[i];
	         			temp++;
	         			}           
	        }
	        //render the ranking with all the info
	        
	        

	        
			res.render('listuser', { ranking: result, user: req.user
	       
   
   //res.json(users);
  		});
  		
	});
	});

	

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle AddFriend POST */
	router.post('/addfriend', function (req, res) {
		console.log(req.param('meemail'));
            console.log(req.param('fremail'));
            
                // find a user in Mongo with provided username
                Friend.findOne({ $and: [ {'meemail': req.param('meemail')}, { 'fremail': req.param('fremail') } ] }, function(err, friend) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in AddFriend: '+err);
                        res.render('home', { user: req.user });
                    }
                    // already exists
                    if (friend) {
                        console.log('Friendship already exist: ');
                        res.render('home', { user: req.user });
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newFriend    = new Friend();
                        newFriend.meemail = req.param('meemail');
                        newFriend.fremail = req.param('fremail');

                        var newFriend1    = new Friend();
                        newFriend1.meemail = req.param('fremail');
                        newFriend1.fremail = req.param('meemail');
                        
                        
                        


                       

                        

                        // save the user
                        newFriend.save(function(err) {
                            if (err){
                                console.log('Error in Saving friendship: '+err);  
                                 
                            }
                            console.log('Add friend succesful');    
                            
                            
                        });

                        newFriend1.save(function(err) {
                            if (err){
                                console.log('Error in Saving friendship: '+err);  
                                 
                            }
                            console.log('Add friend succesful');    
                            res.render('home', { user: req.user });
                            
                        });



                       
                        
                    }
                });
	});

	/* Handle sendmessage POST */
	router.post('/sendmessage', function (req, res) {
		console.log(req.param('fromemail'));
            console.log(req.param('toemail'));
            
                // find a user in Mongo with provided username
                
                        // if there is no user with that email
                        // create the user
                        var newMessage    = new Message();
                        newMessage.from = req.param('fromemail');
                        newMessage.to = req.param('toemail');
                        newMessage.content = req.param('content');
                        newMessage.status = 'unseen'
                        
                        
                        console.log(newMessage.from);
                        console.log(newMessage.to);
                        console.log(newMessage.content);


                       

                        

                        // save the user
                        newMessage.save(function(err) {
                            if (err){
                                console.log('Error in Saving friendship: '+err);  
                                 
                            }
                            console.log('Send message succesful'); 
                            
                            res.render('messagenot', { user: req.user });

                            
                        });



                       
                        
                    
                });
	

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	/* GET Info Page */
	router.get('/info', isAuthenticated, function(req, res){
		res.render('info', { user: req.user });
	});

	/* GET Message Page */
	router.get('/message', isAuthenticated, function(req, res){
		Friend.find(function(err, friendships) {
			var listfriend = {
		            item: [],
		        }
		        console.log(friendships[0].meemail);
		        var temp = 0
		        for(var i = 0; i < friendships.length; i++){
		        	if (friendships[i].meemail==req.user.email)
		         		{	listfriend.item[temp] = friendships[i];
		         			temp++;
		         			}           
		        }

		    	res.render('message', { user: req.user, listfriend: listfriend });
	        });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	return router;
}






