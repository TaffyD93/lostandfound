// Get the functions in the db.js file to use
const db = require('../app/services/db');

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
        console.log('result', result)
        return true;
    }
}

// export module
module.exports  = {
    NewPost
}