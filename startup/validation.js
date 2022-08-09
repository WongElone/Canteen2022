const Joi = require('joi');

function validateMsg(error) {
    return error.details.reduce((accumulator, current) => {
        return [...accumulator, current.message];
    }, []);
}

module.exports.validateMsg = validateMsg;

module.exports.joiSetting = function() {
    Joi.objectId = require('joi-objectid')(Joi);
}