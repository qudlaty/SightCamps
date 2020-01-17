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
  const description = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	
	const newCamp = {name, image, description, author};// es6{use 'n',not 'n:n'}
  //create new camp and save to db
  Camp.create(newCamp, (err, newlyCreated) => {
    if(err){
      console.log(err); //deal with form later
    }else{
			console.log("from CREATE CAMP", newlyCreated);
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
router.get("/camps/:id", (req, res)=>{
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

// EDIT CAMP Route
router.get("/camps/:id/edit", checkCampOwnership, (req, res)=>{
		Camp.findById(req.params.id, (err, foundCamp)=>{
			res.render("camps/edit", {foundCamp});
		});
});

// UPDATE CAMP Route
router.put("/camps/:id", checkCampOwnership, (req, res) => {
	//--find and update correct camp
	//let data = {name: req.body.name}-long way
	Camp.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamp)=>{ //betterway
		if(err){
			res.redirect("/camps");	
		} else{
				//redirect to show page
			res.redirect("/camps/" + req.params.id);
		}
	});
});


//DESTROY
router.delete("/camps/:id", checkCampOwnership, (req, res)=>{
	Camp.findByIdAndRemove(req.params.id, (err,)=>{
		if(err){
			res.redirect("/camps");
		} else{
			res.redirect("/camps");
		}
	});
});


// middleware1
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}
// middleware2
function checkCampOwnership(req, res, next){
	//is user logged??
	if(req.isAuthenticated()){
		Camp.findById(req.params.id, (err, foundCamp)=>{
			if(err){
				res.redirect("back");
			} else {
				//console.log(foundCamp.author.id);-mongoose object
				//console.log(req.user._id);-string, diffrent id's
				//does user own camp??
				if(foundCamp.author.id.equals(req.user._id)){
					//allow next only if both if's are true
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else{
		res.redirect("back");
	}
}

module.exports = router;