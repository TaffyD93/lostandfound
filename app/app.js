// Import express.js
const express = require("express");
const multer = require('multer');
const path = require('path');
const { query } = require('./services/db');

// Create express app
var app = express();

app.set('view engine', 'pug');
app.set('views', './app/views');

// Set the sessions
var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false, 
  saveUninitialized: true,
  cookie: { secure: false }
}));

// User import
const { User } = require("./models/user");

// get access to newPost module
const { NewPost } = require("./models/newPost");

app.use(express.static('styles'))

// Add static files location
app.use(express.static("static"));
app.use(express.static('uploads'));

// Get the functions in the db.js file to use
const db = require('./services/db');

// access data from forms in login/register 
const bodyParser = require('body-parser');
const { url } = require("inspector");
app.use(bodyParser.urlencoded({ extended: true }));

// Register
app.get('/register', function (req, res) {
    res.render('register');
});

// set password for new user
app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        user.getIdFromEmail().then( uId => {
            if (uId) {
                // If a valid, existing user is found, set the password and redirect to the users single-student page
                user.setUserPassword(params.password).then( result => {
                    res.redirect('/userprofile/' + uId);
                });
            }
            else {
                // If no existing user is found, add a new one
                user.addUser(params.email).then( Promise => {
                    res.send('Perhaps a page where a new user sets a programme would be good here');
                });
            }
        })
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Login
app.get('/login', function (req, res) {
    res.render('login');
});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            match = await user.authenticate(params.password);
            if (match) {

                // update logged in attribuet in db (currentuser)
                var sql = "UPDATE Users SET loggedIn = ? WHERE Users.id = ?"
                const result = await db.query(sql, [1, uId]);

                req.session.uid = uId;
                req.session.loggedIn = true;
                res.redirect('/userprofile/' + uId); // dynamic routing to current user's profile
            }
            else {
                res.send('invalid password');
            }
        }
        else {
            res.send('invalid email');
        }
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

// Route for index
app.get("/", function(req, res) {
    var sql = 'SELECT Posts.*, images.path FROM Posts LEFT JOIN images ON Posts.image_id = images.id';
    db.query(sql).then(results => {
        // send results to index template
        res.render('index', {data: results})
    })
});

// dynamic routing for current user
app.get('/userprofile/:uid', function(req, res) {
  var sql = 'SELECT * FROM Posts WHERE Posts.userid = ?';
  db.query(sql, [req.params.uid]).then(
      function(dbResult) {
          // send results to index template
          res.render('userprofile', {data: dbResult})
  })
});

// Configure the storage engine for multer, which is used to handle file uploads
const storage = multer.diskStorage({
    // Specify the directory where uploaded files will be saved
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    // Generate a unique file name for the uploaded file
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
});
  
// Create a multer instance with the storage engine configuration
const upload = multer({ storage: storage });

// Endpoint for make new post form AND handling image uploads
app.post('/upload', upload.single('image'), async (req, res) => {

try {

    // Insert the file path into the database
    const path = req.file.filename;
    const reformattedPath = path.replace("uploads/", "");

    const result = await query('INSERT INTO images (path) VALUES (?)', [reformattedPath]); // add image to img table
    const imageId = result.insertId;

    // make new post with imageid and user id
    const params = req.body
    var post = new NewPost(
        params.name,
        imageId,
        currentDate(),
        params.category.length === 2 ? params.category[0] : params.category, 
        params.category.length === 2 ? params.category[1] : '',
        params.description,
        'temp',
        params.location,
        1
    )

    await post.addPostToDatabase(); // add new post to post table
    await post.addCurrentUserToPost() // add later because of async issues
    res.redirect('/');
    
    } catch (error) {
        // Handle any errors that occur during the file upload or database insertion
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});

// get current date
// source: https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
function currentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = yyyy + '-' + mm + '-' + dd;
    return formattedToday
}

