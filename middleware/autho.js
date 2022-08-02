const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function(req, res, next) {
    const token = req.header('x-authen-token');
    if (!token) return res.status(401).send('Access denied. No authentication token provided.');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.userPayload = decoded;
        next();
    }
    catch(err) {
        return res.status(401).send('Access denied. Invalid authentication token.')
    }
}