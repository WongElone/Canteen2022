module.exports = function() {
    if (!process.env.CANTEEN_JWT_KEY) {
        throw new Error('FATAL ERROR: environment variable CANTEEN_JWT_KEY is not defined.');
    }
    if (!process.env.CANTEEN_DB_HOST) {
        throw new Error('FATAL ERROR: environment variable CANTEEN_DB_HOST is not defined.');
    }
}