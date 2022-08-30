const express = require('express');
const router = express.Router();
const { Dish, validateDish } = require('../models/dish');
const _ = require('lodash');
const { validateMsg } = require('../startup/validation');
const asyncMiddleware = require('../middleware/async-middleware');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const paramsId = require('../middleware/paramsId');
const url = require('url');
const path = require('path');

//////////////// staff routes /////////////////

router.post('/', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const { error } = validateDish(req.body);
    // if (error) return res.status(400).send(validateMsg(error));
    if (error) return res.status(400).redirect(url.format({
        pathname: '/dishes/all',
        query: { errMsgs: JSON.stringify(validateMsg(error)) }
    }));

    let dish = new Dish(_.pick(req.body, ['name', 'price', 'stock']));
    await dish.save();

    res.redirect('/dishes/all');
}));

router.get('/all', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dishes/showDishes.html'));
}));

router.get('/all/data', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const dishes = await Dish.find().sort('name');

    res.send(_.map(dishes, (dish) => _.pick(dish, ['name', 'price'])));
}));


router.post('/deletes', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const names = JSON.parse(req.body.deletes);

    await Dish.deleteMany({ name: { $in: names } });

    res.redirect('all');
}));



////////////// customer routes ////////////////

router.get('/current', asyncMiddleware(async (req, res) => {
    let dishes = await Dish.find().sort('name');

    res.send(
        dishes.reduce((acc, curr) => {
            acc.push(_.pick(curr, ['name', 'price', 'stock']));
            return acc;
        }, [])
    );
}));

module.exports = router;