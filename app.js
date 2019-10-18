const port = 3000,
      express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      Camp = require('./models/campground'),
      seedDB = require('./seeds'),
      Comment = require('./models/comment');


//deprecated solution- lines 8-10
const urlLocal = 'mongodb://localhost/yelp_camp';
/*mongoose.connect('mongodb://localhost/yelp_camp'); -old */
mongoose.connect(urlLocal, {useNewUrlParser: true } );

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

/*seedDB(); // <-add initial camps*/


app.get("/", (req ,res) => {
  res.render('home');
});

//INDEX route- show all camps
app.get("/camps",(req, res) => {
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
app.post("/camps", (req, res) =>{
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
app.get("/camps/new", (req, res) =>{
  res.render("camps/new");
});

//SHOW
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

app.get("/camps/:id/comments/new", (req,res ) => {
  //find camp by id
  Camp.findById(req.params.id, (err, camp) => {
    if(err){
      console.log(err);
    }else {
      res.render("comments/new", {camp: camp});
    }
  });
});

app.post("/camps/:id/comments", (req, res)=> {
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



app.listen(port, () => {
  console.log(`Serwer listening on port ${port}`);
});

  