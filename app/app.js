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

// source: https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
function currentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;

    return formattedToday
}

// npm i body-parser 
// make data from form readable => CHANGE TO MULTER WITH IMAGE
// remove before merge
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// get data from inputform
app.post("/new-post-form", async function(req, res) {
    // params from form (attributes)
    params = req.body
    
    var post = new NewPost(
        params.name,
        'image id',
        currentDate(),
        'CATEGORY',
        'CATEGORY2',
        params.description,
        'UID',
        params.location
    )

    console.log('params', params)
    console.log('body', req.body)

    try {
        await post.storePostInDatabase(post)
        res.redirect('/userprofile');

    } catch(error) {
        console.log('error', error.message)
    }   
});


// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});



