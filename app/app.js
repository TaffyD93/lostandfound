// Import express.js
const express = require("express");
const multer = require('multer');
const path = require('path');
const { query } = require('./services/db');

/* add routing
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


// Configure the storage engine for multer, which is used to handle file uploads
const storage = multer.diskStorage({
    // Specify the directory where uploaded files will be saved
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
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
      // Send a success response to the client
      res.status(200).json({ message: 'Image uploaded successfully' });
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



