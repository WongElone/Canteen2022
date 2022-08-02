module.exports = async function(req, res, next) {
    const isStaff = req.userPayload.isStaff;
    if (!isStaff) return res.status(403).send('Acecess denied. No permission.');
    
    next();
}