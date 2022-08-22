const mongoose = require('mongoose');
const Joi = require('joi');
const myValidation = require('../functions/myValidation');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 55
    },

    dishes: {
        type: [mongoose.ObjectId],
        required: true
    },

    date: {
        type: String,
        required: true
    }

    // later add session and repeat frequency
});

const Menu = mongoose.model('Menu', menuSchema);

function validateMenu(menu) {
    const schema = Joi.object({
        menuName: Joi.string()
                .min(3)
                .max(55)
                .required(),

        dishesNames: Joi.array()
                .items(Joi.string().min(3).max(55))
                .required(),

        date: Joi.string()
                .length(10)
                .pattern(/[0-9]{2}[/][0-9]{2}[/][0-9]{4}/)
                .required()

        // later add session and repeat frequency
    });

    const joiValid = schema.validate(menu);
    
    return ((joiValid.error) ? schema.validate(menu) : myValidation.validateDate(menu.date));
}

function validateMenuPut(changes) {
    const schema = Joi.object({
        name: Joi.string()
                .min(3)
                .max(55),

        dishesId: Joi.array()
                .items(Joi.string().min(3).max(55)),

        date: Joi.string()
                .pattern(/[0-9]{2}[/][0-9]{2}[/][0-9]{4}/)

        // later add session and repeat frequency
    });

    const joiValid = schema.validate(menu);
    
    return ((joiValid.error) ? joiValid : myValidation.validateDate(menu.date));
}

module.exports.menuSchema = menuSchema;
module.exports.Menu = Menu;
module.exports.validateMenu = validateMenu;
module.exports.validateMenuPut = validateMenuPut;