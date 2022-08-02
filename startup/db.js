const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    // const db = 'mongodb://localhost:27017/canteen';
    const db = config.get('db');
    mongoose.connect(db)
        .then(() => console.log(`Connected to ${db}`));    
}