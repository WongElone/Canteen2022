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


    order.dishes = [];

    for (let dishName in (order.dishnamesXqtys || {})) {
        const dish = await Dish.findOne({ name: dishName });
        
        if (dish) {
            order.dishes.push({
                dishName: dishName,
                qty: order.dishnamesXqtys[dishName],
                price: dish.price * order.dishnamesXqtys[dishName]
            });
        }
        else break;
    }

    if (order.dishes == undefined || order.dishes.length != Object.keys(order.dishnamesXqtys).length) {
        return res.status(404).send('Some dishes not found, please try agin');
    }

    order = new Order(_.pick(order, ['customerId', 'dishes', 'appointTime', 'appointDate']));

    await order.save();

    // res.sendFile(path.join(__dirname, '../public/orders/newSuccess.html'));
    res.redirect('/orders/yourOrders');
}));


router.get('/yourOrders', [autho, notStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/orders/yourOrders.html'));
}));


router.get('/customerOrders', [autho, notStaff], asyncMiddleware(async (req, res) => {
    const orders = await Order.find({ customerId: req.userPayload._id, appointDate: myTime.todayHKDate(), isCompleted: false }).sort('appointTime');;

    res.send(_.map(orders, (order) => _.pick(order, ['dishes', 'appointTime'])));
}));


router.get('/todayOrders', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/orders/todayOrders.html'));
}));


router.get('/today', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const orders = await Order.find({ appointDate: myTime.todayHKDate(), isCompleted: false }).sort('appointTime');

    // add customer info (name and contact)
    for (const order of orders) {
        const customer = await User.findById({ _id: order.customerId });
        if (!customer) return res.status(404).send('customer not found');
        
        order.username = customer.username;
        order.phone = customer.phone;
    }

    res.send(_.map(orders, (order) => _.pick(order, ['_id', 'username', 'phone', 'dishes', 'appointTime'])));
}));


router.post('/completes', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const doneOrdersIds = JSON.parse(req.body.doneOrdersIds);

    const doneOrders = await Order.find({ _id: doneOrdersIds });

    for (const order of doneOrders) {
        order.isCompleted = true;
        await order.save();
    }

    res.redirect('/orders/todayOrders');
}));


router.get('/completedOrders', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/orders/completedOrders.html'));
}));


router.get('/areCompleted', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const orders = await Order
    .find({ isCompleted: true })
    .sort({ appointDate: 1, appointTime: 1 });

    // add customer info (name and contact)
    for (const order of orders) {
        const customer = await User.findById({ _id: order.customerId });
        if (!customer) return res.status(404).send('customer not found');
        
        order.username = customer.username;
        order.phone = customer.phone;
    }

    res.send(_.map(orders, (order) => _.pick(order, ['_id', 'username', 'phone', 'dishes', 'appointTime'])));
}));


router.get('/abandonedOrders', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/orders/abandonedOrders.html'));
}));


router.get('/abandoned', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const orders = await Order
    .find({ appointDate: { $ne: myTime.todayHKDate() }, isCompleted: false })
    .sort({ appointDate: 1, appointTime: 1 });

    // add customer info (name and contact)
    for (const order of orders) {
        const customer = await User.findById({ _id: order.customerId });
        if (!customer) return res.status(404).send('customer not found');
        
        order.username = customer.username;
        order.phone = customer.phone;
    }

    res.send(_.map(orders, (order) => _.pick(order, ['_id', 'username', 'phone', 'dishes', 'appointTime'])));
}));


router.post('/deletes', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const deleteOrdersIds = JSON.parse(req.body.deleteOrdersIds);

    await Order.deleteMany({ _id: { $in: deleteOrdersIds }});

    res.sendFile(path.join(__dirname, '../public/orders/deleteSuccess.html'));
}));


module.exports = router;