const express = require("express"),
		router = express.Router(),
		Camp = require('../models/campground');

//===ROUTES===

router.get("/", (req ,res) => {
  res.redirect('./camps');
});

//INDEX route- show all camps
router.get("/camps",(req, res) => {
	//console.log(req.user);
  // get camps from db
  Camp.find({}, (err, allCamps) => {
    if(err){
      console.log(err);
    }else{
      //render data
      res.render('camps/index', {camps: allCamps});
    }
  });
});

//CREATE - add new to db 
router.post("/camps", isLoggedIn, (req, res) =>{
  // get data from form
  const name = req.body.name;
  const image = req.body.url;
  const description = req.body.description
  const newCamp = {name, image, description};// es6
  //create new camp and save to db
  Camp.create(newCamp, (err, newCamp) => {
    if(err){
      console.log(err); //deal with form later
    }else{
      //redirect back to camps page
      res.redirect("/camps");
    }
  });
}); 

//NEW -show form to create new camp
router.get("/camps/new", isLoggedIn, (req, res) =>{
  res.render("camps/new");
});

//SHOW camp
router.get("/camps/:id", (req, res) => {
  //find camp with provided id
  Camp.findById(req.params.id).populate('comments').exec((err, foundCamp) =>{
    if(err){
      console.log(err);
    }else{
      //console.log(foundCamp);
      //render 'show.ejs' template with that camp
      res.render("camps/show", {camp: foundCamp});
    }
  });
  req.params.id
});

function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
