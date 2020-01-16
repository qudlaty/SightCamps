const express = require("express"),
		router = express.Router({mergeParams: true}),//merge params from camps and comms
		Camp = require('../models/campground'),
		Comment = require('../models/comment');


// Comments New -nested routes
router.get("/new", isLoggedIn, (req,res ) => {
  //find camp by id
	console.log(req.params.id)
  Camp.findById(req.params.id, (err, camp) => {
    if(err){
      console.log(err);
    }else {
      res.render("comments/new", {camp: camp});
    }
  });
});

//Comments Create
router.post("/", isLoggedIn, (req, res)=> {
  //lookup camp using ID
  Camp.findById(req.params.id, (err, camp)=> {
    if(err){
      console.log(err);
      redirect("/camps");
    }else {
      console.log(req.body.comment);
      Comment.create(req.body.comment, (err, comment)=> {
        if(err){
          console.log(err);
        }else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					console.log(req.user.username,'from comments');
          //create new comment
          camp.comments.push(comment); 
          //connect new comment to camp
          camp.save();
          //redirect camp show page
          res.redirect('/camps/' + camp._id);
        }
      });
    }
  });
});

//Comments Edit-nested 
router.get("/:comment_id/edit", (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {onlyCamp_id: req.params.id, foundComment});
		}
	});
});

//Comments Update
//router.put("/camps/:id/comments/comment_id"-how it's really looking 
router.put("/:comment_id", (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/camps/" + req.params.id);
		}
	});
});



//middleware
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
