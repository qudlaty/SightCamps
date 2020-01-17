const express = require("express"),
			router = express.Router(),
			User = require("../models/user"),
			passport = require("passport");


// AUTHORIZATION ROUTES

//show register
router.get("/register", (req, res) => {
	res.render("register");
});

// sign up logic
router.post('/register', (req, res)=>{
	
	let newUser = new User({username: req.body.username}); 
	
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, ()=>{
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
	res.redirect('/camps');
});


//middleware
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;