const port = 3000,
      express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      //seedDB = require('./seeds'),
			passport = require("passport"),
			LocalStrategy = require("passport-local"),
			User = require("./models/user"),
			Camp = require('./models/campground'),
      Comment = require('./models/comment');


//deprecated solution- lines 8-10
const urlLocal = 'mongodb://localhost/yelp_camp';
/*mongoose.connect('mongodb://localhost/yelp_camp'); -old */
mongoose.connect(urlLocal, {useNewUrlParser: true } );

//app config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
/*seedDB(); // <-add initial camps*/

//passport config
app.use(require("express-session")({
	secret: "Some string to decode",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass user to all routes, middleware
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	next();
});


//===ROUTES=================================


app.get("/", (req ,res) => {
  res.render('home');
});

//INDEX route- show all camps
app.get("/camps",(req, res) => {
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
app.post("/camps", isLoggedIn, (req, res) =>{
  // get data from form
  const name = req.body.name;
  const image = req.body.url;
  const desc = req.body.description
  const newCamp = {name: name, image: image, description: desc};
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
app.get("/camps/new", isLoggedIn, (req, res) =>{
  res.render("camps/new");
});

//SHOW camp
app.get("/camps/:id", (req, res) => {
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


// COMMENTS ROUTES -nested routes

app.get("/camps/:id/comments/new", isLoggedIn, (req,res ) => {
  //find camp by id
  Camp.findById(req.params.id, (err, camp) => {
    if(err){
      console.log(err);
    }else {
      res.render("comments/new", {camp: camp});
    }
  });
});

app.post("/camps/:id/comments", isLoggedIn, (req, res)=> {
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


// AUTHORIZATION ROUTES

//show register
app.get("/register", (req, res) => {
	res.render("register");
});

// sign up logic
app.post('/register', (req, res)=>{
	
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
app.get("/login", (req, res) => {
	res.render("login");
});

//handle login fast 
app.post("/login", passport.authenticate('local', {
	successRedirect: '/camps',
	failureRedirect: '/login',
	//failureFlash: 'true'-  add message
}), (req, res) => {
});//callabck not nececery here if never used

// logout route
app.get('/logout', (req, res) => {
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



app.listen(port, () => {
  console.log(`Serwer listening on port ${port}`);
});

  