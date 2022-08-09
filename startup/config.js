const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: environment variable canteen_jwtPrivateKey is not defined.');
    }
    if (!config.get('db')) {
        throw new Error('FATAL ERROR: environment variable canteen_db is not defined.');
    }
}