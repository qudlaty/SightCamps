// all medllewaregoes here
const Camp = require("../models/camp"),
			Comment = require("../models/comment")
			middlewareObj = {};

	middlewareObj.checkCampOwnership = (req, res, next)=>{
		//is user logged??
		if(req.isAuthenticated()){
			Camp.findById(req.params.id, (err, foundCamp)=>{
				if(err){
					req.flash("error", "Camp not found");//flash message
					res.redirect("back");
				} else {
					//console.log(foundCamp.author.id);-mongoose object
					//console.log(req.user._id);-string, diffrent id's
					//does user own camp??
					if(foundCamp.author.id.equals(req.user._id)){
						//allow next only if both if's are true
						next();
					} else {
						req.flash("error", "You need to be owner");//flash message
						res.redirect("back");
					}
				}
			});
		} else{
			req.flash("error", "Please login first");//flash message
			res.redirect("back");
		}
	}

	middlewareObj.checkCommentOwnership = (req, res, next)=>{
		//is user logged??
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, (err, foundComment)=>{
				if(err){
					req.flash("error", "Comment not found");
					res.redirect("back");
				} else {
					//does user own comment??
					if(foundComment.author.id.equals(req.user._id)){
						//allow next only if both if's are true
						next();
					} else {
						req.flash("error", "You need to be owner");
						res.redirect("back");
					}
				}
			});
		} else{
			req.flash("error", "Please login first");
			res.redirect("back");
		}
	}

	middlewareObj.isLoggedIn = (req, res, next)=>{
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error", "Please login first");
		res.redirect('/login');
	}

module.exports = middlewareObj
