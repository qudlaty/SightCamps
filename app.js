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

//seedDB(); // <-add initial camps

/*
OLD SEED
Camp.create(
  {
    name: 'Next tent',
    image: 'https://ak.picdn.net/offset/photos/54a2e01aa6dfde507e9fcfd2/medium/offset_171435.jpg',
    description: "Some random pic with tent"
  },(err, camp) =>{ //callback fn
    if(err){
      console.log(err);
    }else{
      console.log("New camp: ");
      console.log(camp);
    }
  });*/

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
      res.render('index', {camps: allCamps});
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
  res.render("new.ejs");
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
      res.render("show", {camp: foundCamp});
    }
  });
  req.params.id
});



app.listen(port, () => {
  console.log(`Yelp serwer listening on port ${port}`);
});