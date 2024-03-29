// Get the functions in the db.js file to use
const db = require('../services/db');

class NewPost {

    // attributes to (new) post 
    id; 
    item_name; 
    image_id;
    date;
    category;
    category2;
    description;
    userid;
    location;
    found;

    constructor(item_name, image_id, date, category, category2,description, userid, location, found) {
        this.item_name = item_name;
        this.image_id = image_id;
        this.date = date;
        this.category = category;
        this.category2 = category2;
        this.description = description;
        this.userid = userid;
        this.location = location;
        this.found = found;
    }

    // push new post to posts table in db
    async addPostToDatabase() {
        // var sql = `INSERT INTO Posts(item_name, image_id, date, category, category2, description, userid, location, found) VALUES (${this.item_name}, ${this.image_id}, ${this.date}, ${this.category}, ${this.category2}, ${this.userid}, ${this.location}, ${this.found})`;
        var sql = "INSERT INTO Posts(item_name, image_id, date, category, category2, description, userid, location, found) VALUES (?,?,?,?,?,?,?,?,?)";
        const result = await db.query(sql, [this.item_name, this.image_id, this.date, this.category, this.category2, this.description, this.userid, this.location, this.found]); // insert into db
        return true;
    }

    async addCurrentUserToPost() {
        // get current users id
        var sql = 'SELECT id FROM Users WHERE Users.loggedIn = ?';
        const result = await db.query(sql, [1]);
        const currentuserId = result[0].id.toString()

        var sql2 = "UPDATE Posts SET userid = ? WHERE userid = ?" 
        const results = await db.query(sql2, [currentuserId, 'temp']) 
        return true;
    }
}

// export module
module.exports  = {
    NewPost
}