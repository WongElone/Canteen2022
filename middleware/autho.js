const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
    const token = req.cookies.x_authen_token;
    
    if (!token) return res.status(401).redirect('/authen/login');

    try {
        const decoded = jwt.verify(token, process.env.CANTEEN_JWT_KEY);
        req.userPayload = decoded;
        next();
    }
    catch(err) {
        return res.status(401).redirect('/authen/login');
    }
}