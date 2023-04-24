// Import express.js
const express = require("express");

/* // add routing
const router = express.Router() */

// Create express app
var app = express();

app.set('view engine', 'pug');
app.set('views', './app/views');

// Add css styling
/* app.use(express.static('styles', './app/styles')) */
app.use(express.static('styles'))

// Add static files location
app.use(express.static("static"));

// get access to newPost module
const { NewPost } = require("./models/newPost");

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    var sql = 'select * from Posts';
    db.query(sql).then(results => {
        // send results to index template
        res.render('index', {data: results})
    })
});

// Create a route for userprofile
// => "/userprofile/:username"
// Create a route for root - /
app.get("/userprofile", function(req, res) {
    var sql = 'select * from Posts';
    db.query(sql).then(results => {
        // send results to index template
        res.render('userprofile', {data: results})
    })
});

// npm i body-parser 
// make data from form readable => CHANGE TO MULTER WITH IMAGE
// remove before merge
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// get data from inputform
app.post("/new-post-form", async function(req, res) {
    //const params = JSON.stringify(req.body.item_name);
    params = req.body
 
    var post = new NewPost(params.item_name);
    console.log('params', params)
    console.log('body', req.body)

    try {
        await post.setNewPost(params.item_name)
        res.redirect('/userprofile');

    } catch(error) {
        console.log('error', error.message)
    }   
});


// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});



