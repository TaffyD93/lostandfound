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
const { User } = require("../models/user");

// Add css styling
/* app.use(express.static('styles', './app/styles')) */
app.use(express.static('styles'))

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Register
app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    console.log(user)
    try {
        user.getIdFromEmail().then( uId => {
            if (uId) {
                // If a valid, existing user is found, set the password and redirect to the users single-student page
                user.setUserPassword(params.password).then( result => {
                    res.redirect('/userprofile');
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

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
