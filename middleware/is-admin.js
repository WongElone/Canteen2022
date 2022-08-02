module.exports = async function(req, res, next) {
    const isAdmin = req.userPayload.isAdmin;
    if (!isAdmin) return res.status(403).send('Acecess denied. No permission.');
    
    next();
}