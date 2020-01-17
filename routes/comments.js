const express = require("express"),
			router = express.Router({mergeParams: true}),//merge params from camps and comms
			Camp = require('../models/camp'),
			Comment = require('../models/comment'),
			middleware = require("../middleware");

// Comments New -nested routes
router.get("/new", middleware.isLoggedIn, (req,res ) => {
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
router.post("/", middleware.isLoggedIn, (req, res)=> {
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
//router.put("/camps/:id/comments/comment_id/edit"-how it's looking 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {onlyCamp_id: req.params.id, foundComment});
		}
	});
});

//Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(
		req.params.comment_id, req.body.comment, (err, updatedComment)=>{
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/camps/" + req.params.id);
		}
	});
});

//Comments DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	//findById and delete
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/camps/" + req.params.id);
		}
	});
});

module.exports = router;
