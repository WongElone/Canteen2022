const mongoose = require('mongoose');
const Joi = require('joi');
const myValidation = require('../functions/myValidation');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.ObjectId,
        required: true
    },

    dishesXqtys: {
        type: [new mongoose.Schema({
            dishName: {
                type: String,
                minLength: 3,
                maxLengh: 55,
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        })],
        required: true
    },

    appointTime: {
        type: String,
        required: true
    },

    appointDate: {
        type: String,
        required: true
    },

    isCompleted: {
        type: Boolean,
        default: false
    }
});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
    const schema = Joi.object({
        customerId: Joi.objectId()
                .required(),

        dishnamesXqtys: Joi.object()
                .pattern(
                    Joi.string().min(3).max(55).required(), // kdy (dishName) pattern
                    Joi.number().min(0).max(9).required()) // value (qty) pattern
                // .array()
                // .items(Joi.object({
                //     dishName: Joi.string().min(3).max(55).required(),
                //     qty: Joi.number().required()
                // }))
                .required(),

        appointTime: Joi.string()
                .length(5)
                .pattern(/[0-1][0-9][:][0-5][0-9]/)
                .required(),

        appointDate: Joi.string()
                .length(10)
                .pattern(/[0-9]{2}[/][0-9]{2}[/][0-9]{4}/)
                .required()
    });

    const joiValid = schema.validate(order);
    
    const timeValid = myValidation.validateTime(order.appointTime);
    
    return ((joiValid.error) ? joiValid : (
        (timeValid.error) ? timeValid : myValidation.validateDate(order.appointDate)
        ));
}

function validateOrderPut(changes) {
    const schema = Joi.object({
        username: Joi.string()
                .min(3)
                .max(55),

        dishesNames: Joi.array()
                .items(Joi.string().min(3).max(55))
                .required(),

        appointTime: Joi.string()
                .length(5)
                .pattern(/[0-2][0-9][:][0-5][0-9]/)
                .required(),

        appointDate: Joi.string()
                .length(10)
                .pattern(/[0-9]{2}[/][0-9]{2}[/][0-9]{4}/)
                .required()
    });

    const joiValid = schema.validate(order);

    const timeValid = myValidation.validateTime(order.appointTime);
    
    return ((joiValid.error) ? joiValid : (
        (timeValid.error) ? timeValid : myValidation.validateDate(order.appointDate)
        ));
}

module.exports.Order = Order;
module.exports.orderSchema = orderSchema;
module.exports.validateOrder = validateOrder;
module.exports.validateOrderPut = validateOrderPut;