const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { validateMsg } = require('../startup/validation');
const asyncMiddleware = require('../middleware/async-middleware');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const notStaff = require('../middleware/not-staff');
const { Order, validateOrder } = require('../models/order');
const { Dish } = require('../models/dish');
const { User } = require('../models/user');
const path = require('path');
const url = require('url');
const myTime = require('../functions/myTime');

router.get('/new', [autho, notStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/orders/newOrder.html'));
}));

router.post('/', [autho, notStaff], asyncMiddleware(async (req, res) => {
    const todayHKDate = myTime.todayHKDate();

    let order = {
        customerId: req.userPayload._id,
        dishnamesXqtys: JSON.parse(req.body.dishnamesXqtys),
        appointTime: req.body.appointTime,
        appointDate: todayHKDate
    };

    const { error } = validateOrder(order);
    if (error) return res.status(400).send(validateMsg(error));

    const customer = await User.findById(order.customerId);
    if (!customer) return res.status(404).send('User not registered');


    order.dishesXqtys = [];

    for (let dishName in (order.dishnamesXqtys || {})) {
        const dish = await Dish.findOne({ name: dishName });
        
        if (dish) {
            order.dishesXqtys.push({
                dishName: dishName,
                qty: order.dishnamesXqtys[dishName]
            });
        }
        else break;
    }

    if (!order.dishesXqtys.length || order.dishesXqtys.length != Object.keys(order.dishnamesXqtys).length) {
        return res.status(404).send('Some dishes not found, please try agin');
    }

    order = new Order(_.pick(order, ['customerId', 'dishesXqtys', 'appointTime', 'appointDate']));

    await order.save();

    res.sendFile(path.join(__dirname, '../public/orders/newSuccess.html'));
}));

router.get('/yourOrders', [autho, notStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/orders/yourOrders.html'));
}));

router.get('/customerOrders', [autho, notStaff], asyncMiddleware(async (req, res) => {
    const orders = await Order.find({ customerId: req.userPayload._id, appointDate: myTime.todayHKDate() });

    res.send(_.map(orders, (order) => _.pick(order, ['dishesXqtys', 'appointTime'])));
}));

router.get('/todayOrders', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/orders/todayOrders.html'));
}));

router.get('/today', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const orders = await Order.find({ appointDate: myTime.todayHKDate() });

    // add customer info (name and contact)
    for (const order of orders) {
        const customer = await User.findById({ _id: order.customerId });
        if (!customer) return res.status(404).send('customer not found');
        
        order.username = customer.username;
        order.phone = customer.phone;
    }

    res.send(_.map(orders, (order) => _.pick(order, ['username', 'phone', 'dishesXqtys', 'appointTime'])));
}));


module.exports = router;