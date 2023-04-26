// Get the functions in the db.js file to use
// const db = require('../services/db');

class NewPost {

    // attributes to (new) post 
    id; 
    item_name; 
   // image_id;
    date;
    category;
    category2;
    uid;
    description;
    location;

    // image_id,
    constructor(item_name,  date, category, category2, uid, description, location) {
        this.item_name = item_name;
        //this.image_id = image_id;
        this.date = date;
        this.category = category;
        this.category2 = category2;
        this.uid = uid;
        this.description = description;
        this.location = location;
    }

    async storePostInDatabase(post) {
        console.log('sender fra newpost model', post)
    }
}

// export module
module.exports  = {
    NewPost
}