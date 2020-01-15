const mogoose = require('mongoose'),
      Campground = require('./models/campground'),
      Comment = require("./models/comment");

 
const data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et . "
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et . "
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et . "
    }
]
 
/*function seedDB(){
   //Remove all campgrounds1
   Campground.remove({}, (err)=>{
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, (err) =>{
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach((seed)=>{
                Campground.create(seed, (err, campground)=>{
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, (err, comment)=>{
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}*/


/// ASYNC/AWAIT refactoring

async function seedDB(){
  
  try {
    
  await Comment.remove({});
  console.log("Comments removed");
  
  await Campground.remove({});
  console.log("Camps removed");
  
  for(const datum of data){
    let campground = await Campground.create(datum);
    console.log("Camp created");
    
    let comment = await Comment.create(
      {
        text: 'This place is great, but I wish there was internet',
        author: 'Homer'
      }
    )
    console.log("Created new comment");
    
    campground.comments.push(comment);
    campground.save(); 
    console.log("Comment added to camp");
  } 
    
  } catch(err) {
    console.log(err);
  }        
}
  
module.exports = seedDB;

