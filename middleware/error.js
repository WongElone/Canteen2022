
module.exports = function(err, req, res, next) {
    error.log(err);

    res.status(500).send('Something failed in request processing pipeline.');
}