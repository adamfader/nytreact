// Include Server Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//Require Article Schema
var Article = require('./models/Article.js');

// Create Instance of Express
var app = express();
var PORT = process.env.PORT || 3000; // Sets an initial port. We'll use this later in our listener

// Run Morgan for Logging
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));

// -------------------------------------------------

var uristring = process.env.MONGODB_URI || process.env.MONGOHQ_URL;

// MongoDB Configuration configuration (Change this URL to your own DB)
mongoose.connect(uristring);
var db = mongoose.connection;

db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function () {
  console.log('Mongoose connection successful.');
});


// -------------------------------------------------

// Main Route. This route will redirect to our rendered React application
app.get('/', function(req, res){
  res.sendFile('./public/index.html');
})

// This is the route we will send GET requests to retrieve all saved articles.
app.get('/api/saved', function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  Article.find({}).sort([['date', 'descending']]).limit(5)
    .exec(function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    })
});

// This is the route we will send POST requests to save each search.
app.post('/api/saved', function(req, res){
  var newSearch = new Article(req.body);
  console.log("BODY: " + newSearch);

  Article.count({'title': req.body.title}, function (err, count){ 
    if(count > 0){
        console.log('Already exists!');
    }else{
      // Here we'll save the article based on the JSON input. 
      Article.create({"title": req.body.title, "lead": req.body.lead, "date": req.body.date, "url": req.body.url}, function(err){
        if(err){
          console.log(err);
        }
        else {
          // res.send("Saved Search");
          res.json({status: 'saved'})
        }
      })
    }
  }); 

});

// Delete One from the DB
app.delete('/api/saved/:id', function(req, res) {

  // remove a note using the objectID
  Article.remove({"_id": req.params.id})
  .exec(function(err, data) {
    // log any errors from mongojs
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

// -------------------------------------------------

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
