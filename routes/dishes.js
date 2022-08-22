const express = require('express');
const router = express.Router();
const { Dish, validateDish, validateDishPut } = require('../models/dish');
const _ = require('lodash');
const { validateMsg } = require('../startup/validation');
const asyncMiddleware = require('../middleware/async-middleware');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const paramsId = require('../middleware/paramsId');
const url = require('url');
const querystring = require('../functions/querystring');

//////////////// staff routes /////////////////

router.post('/', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const { error } = validateDish(req.body);
    // if (error) return res.status(400).send(validateMsg(error));
    if (error) return res.status(400).redirect(url.format({
        pathname: '/dishes/all',
        query: { errMsgs: querystring.arr2param(validateMsg(error)) }
    }));

    let dish = new Dish(_.pick(req.body, ['name', 'price', 'stock']));
    await dish.save();

    res.redirect('/dishes/all');
}));

router.get('/all', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.render('dishes/showDishes');

    // const dishes = await Dish.find().sort('name');

    // res.render('dishes/showDishes', { 
    //     dishes: _.map(dishes, (dish) => _.pick(dish, ['name', 'price'])),
    //     query: req.query
    // });
}));

router.get('/all/data', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const dishes = await Dish.find().sort('name');

    res.send(_.map(dishes, (dish) => _.pick(dish, ['name', 'price'])));
}));

router.get('/:id/staff', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).send('The dish with the given ID was not found.');

    res.send(dish);
}));

router.put('/:id/staff', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
    const { error } = validateDishPut(req.body);
    if (error) return res.status(400).send(validateMsg(error));

    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).send('The dish with the given ID was not found.');

    for (let key in req.body) {
        dish[key] = req.body[key];
    }

    await dish.save();
    
    res.send(dish);
}));

router.post('/deletes', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const names = req.body.deletes.split(';,.');

    await Dish.deleteMany({ name: { $in: names } });

    res.redirect('all');
}));

router.delete('/:id/staff', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
    const dish = await Dish.findByIdAndRemove(req.params.id);
    if (!dish) return res.status(404).send('The dish with the given ID was not found.');

    res.send(dish);
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

router.get('/:id/customer', [autho, paramsId], asyncMiddleware(async (req, res) => {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).send('The dish with the given ID was not found.');

    res.send(_.pick(dish, ['name', 'price', 'stock']));
}));

module.exports = router;