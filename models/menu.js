const mongoose = require('mongoose');
const Joi = require('joi');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 55
    },

    dishes: {
        type: [new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 55
                // unique: true
            },
        
            price: {
                type: Number,
                required: true,
                min: 0,
                max: 1023
            },
        
            stock: {
                type: Number,
                default: 0,
                min: 0,
                max: 255
            }
        })],
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
        name: Joi.string()
                .min(3)
                .max(55)
                .required(),

        dishesId: Joi.array()
                    .items(Joi.objectId())
                    .required(),

        date: Joi.string().required()

        // later add session and repeat frequency
    });

    return schema.validate(menu);
}

function validateMenuPut(changes) {
    const schema = Joi.object({
        name: Joi.string()
                .min(3)
                .max(55),

        dishesId: Joi.array()
                    .items(Joi.objectId()),

        date: Joi.string()

        // later add session and repeat frequency
    });

    return schema.validate(changes);
}

module.exports.menuSchema = menuSchema;
module.exports.Menu = Menu;
module.exports.validateMenu = validateMenu;
module.exports.validateMenuPut = validateMenuPut;