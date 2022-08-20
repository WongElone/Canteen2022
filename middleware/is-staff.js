module.exports = async function(req, res, next) {
    const isStaff = req.userPayload.isStaff;
    if (!isStaff) return res.status(403).redirect('users/welcome');
    
    next();
}