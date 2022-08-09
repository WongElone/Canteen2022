const Joi = require('joi');

module.exports = function(req, res, next) {
    const schema = Joi.object({
        paramsId: Joi.objectId().required()
    });

    const { error } = schema.validate({ paramsId: req.params.id });
    if (error) return res.status(400).send(`Fail to cast route params id: ${req.params.id} to ObjectId`);
    
    next();
}