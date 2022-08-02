const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 55,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    phone: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 8,
        unique: true
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthenToken = function() {
    return jwt.sign({ _id: this._id, isStaff: this.isStaff, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string()
            .pattern(/^[a-zA-Z0-9_\s]*$/)
            .min(3)
            .max(55)
            .required(),

        password: Joi.string()
            .pattern(/^[a-zA-Z0-9_\s]*$/)
            .min(8)
            .max(32)
            .required(),

        confirm_password: Joi.string()
            .pattern(/^[a-zA-Z0-9_\s]*$/)
            .min(8)
            .max(32)
            .required()
            .valid(Joi.ref('password')),

        phone: Joi.string()
            .pattern(/^[0-9]{8}$/)
            .required(),

        isStaff: Joi.boolean()
    });

    return schema.validate(user);
}

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validateUser = validateUser;
