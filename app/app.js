// Import express.js
const express = require("express");

const multer = require('multer');

const path = require('path');
/* // add routing
const router = express.Router() */

// Create express app
var app = express();

app.set('view engine', 'pug');
app.set('views', './app/views');

// User import
const { User } = require("./models/user");

// Add css styling
/* app.use(express.static('styles', './app/styles')) */
app.use(express.static('styles'))

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Set the sessions
var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Register
app.get('/register', function (req, res) {
    res.render('register');
    
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
              req.session.uid = uId;
              req.session.loggedIn = true;
              console.log(req.session);
              res.redirect('/userprofile/' + uId);
          }
          else {
              // TODO improve the user journey here
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
    var email = req.body.params.email;
    var user = new User (params.email);
    console.log(params.email)
    user.getIdFromEmail();
});

app.post('/set-password', async function (req, res) {
  params = req.body;
  var user = new User(params.email);
  try {
      uId = await user.getIdFromEmail();
      if (uId) {
          // If a valid, existing user is found, set the password and redirect to the users single-student page
          await user.setUserPassword(params.password);
          res.redirect('/single-student/' + uId);
      }
      else {
          // If no existing user is found, add a new one
          newId = await user.addUser(params.email);
          res.send('Perhaps a page where a new user sets a programme would be good here');
      }
  } catch (err) {
      console.error(`Error while adding password `, err.message);
  }
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
              res.redirect('/single-student/' + uId);
          }
          else {
              // TODO improve the user journey here
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

// Configure the storage engine for multer, which is used to handle file uploads
const storage = multer.diskStorage({
    // Specify the directory where uploaded files will be saved
    destination: (req, file, cb) => {
      cb(null, 'images/uploads')
    },
    // Generate a unique file name for the uploaded file
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
  });
  
  // Create a multer instance with the storage engine configuration
  const upload = multer({ storage: storage });
  
  
  // Define an endpoint for handling image uploads
  app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Insert the file path into the database
    const { path } = req.file;
    await query('INSERT INTO images (path) VALUES (?)', [path]);
  
    // Construct the URL of the uploaded image
    const imagePath = `images/uploads/${req.file.filename}`;
  
    // Construct the HTML response to include the uploaded image
    const htmlResponse = `
      <img src="${imagePath}" alt="Uploaded image" />
    `;
  
    // Send the HTML response back to the client
    res.send(htmlResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  });

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
