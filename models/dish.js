const mongoose = require('mongoose');
const Joi = require('joi');

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 55,
        unique: true
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
});

const Dish = mongoose.model('Dish', dishSchema);

function validateDish(dish) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(55)
            .required(),
        
        price: Joi.number()
            .min(0)
            .max(1023)
            .required(),
        
        stock: Joi.number()
            .min(0)
            .max(255)
    });

    return schema.validate(dish);
}

function validateDishPut(changes) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(55),
        
        price: Joi.number()
            .min(0)
            .max(1023),
        
        stock: Joi.number()
            .min(0)
            .max(255)
    });

    return schema.validate(changes);
}

module.exports.dishSchema = dishSchema;
module.exports.Dish = Dish;
module.exports.validateDish = validateDish;
module.exports.validateDishPut = validateDishPut;
