const mongoose = require('mongoose');

module.exports = function() {
    // const db = 'mongodb://localhost:27017/canteen';
    const db = process.env.CANTEEN_DB_HOST;
    mongoose.connect(db)
        .then(() => console.log(`Connected to ${db}`));    
}