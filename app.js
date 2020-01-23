const port = 3000,
      express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      //seedDB = require('./seeds'),
			flash = require("connect-flash"),
			passport = require("passport"),
			methodOverride = require("method-override"),
			LocalStrategy = require("passport-local"),
			User = require("./models/user"),
			Camp = require('./models/camp'),
      Comment = require('./models/comment');

//req routes
const commentsRoutes = require("./routes/comments"),
			campsRoutes = require("./routes/camps"),
			authRoutes = require("./routes/index");


// deprecated mongoose?
const urlLocal = 'mongodb://localhost/yelp_camp';
mongoose.connect(urlLocal, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false} );

//app config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
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
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//routes
app.use(authRoutes);
app.use(campsRoutes);
app.use("/camps/:id/comments", commentsRoutes);
// shorter path in comments routes^



app.listen(port, () => {
  console.log(`Serwer listening on port ${port}`);
});

  