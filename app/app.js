// Import express.js
const express = require("express");
const multer = require('multer');
const path = require('path');
const { query } = require('./services/db');

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
app.use(express.static('uploads'));

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

    const formattedToday = yyyy + '-' + mm + '-' + dd;
    return formattedToday
}

// npm i body-parser 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// get data from inputform
app.post("/new-post-form", async function(req, res) {

    

    try {
        await post.addPostToDatabase();
        res.redirect('/userprofile');

    } catch(error) {
        console.log('error', error.message)
    }   
});

/******** UPLOAD IMAGE  *********/
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

  function reformatPath(path) {
    let formatted = path.replace("uploads/", "")
    console.log("formatted", formatted)
    return formatted
}
  
  // Define an endpoint for handling image uploads
  app.post('/upload', upload.single('image'), async (req, res) => {
    
    // params from form (attributes)
    params = req.body
    var post = new NewPost(
        params.name,
        1,
        currentDate(),
        params.category.length === 2 ? params.category[0] : params.category, 
        params.category.length == 2 ? params.category[1] : '',
        params.description,
        1,
        params.location
    )

    try {
      // Insert the file path into the database
      const { path } = req.file;
      const reformattedPath = reformatPath(path)

      await query('INSERT INTO images (path) VALUES (?)', [reformattedPath]); // add image to img table
      await post.addPostToDatabase(); // add new post to post table
      res.render('userprofile', {reformattedPath});
      // Send a success response to the client
      //res.status(200).json({ message: 'Image uploaded successfully' });
      
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



