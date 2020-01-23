const express = require("express"),
			router = express.Router(),
			passport = require("passport"),
			User = require("../models/user");
			


// AUTHORIZATION ROUTES

/*//root route
router.get("/",(req, res)=>{
    res.render("home");
});*/

//show register
router.get("/register", (req, res) => {
	res.render("register");
});

//handle sign up logic
router.post('/register', (req, res)=>{
	let newUser = new User({username: req.body.username}); 
	
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			//other fix- replace render with redirect
			//req.flash("error", err.message);
			return res.render('register', {error: err.message});
		}
		passport.authenticate('local')(req, res, ()=>{
			req.flash("success", "Welcome to Camps " + user.username);
			res.redirect('/camps');
		});
	});
});

//show login
router.get("/login", (req, res) => {
	res.render("login");
});

//handle login fast 
router.post("/login", passport.authenticate('local', {
	successRedirect: '/camps',
	failureRedirect: '/login',
	//failureFlash: 'true'-  add message 
	}), (req, res) => {
});//callabck not necessary here if never used

// logout route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success'," You now logged out");
	res.redirect('/camps');
});

module.exports = router;
