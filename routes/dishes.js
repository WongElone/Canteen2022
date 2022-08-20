const express = require('express');
const router = express.Router();
const { Dish, validateDish, validateDishPut } = require('../models/dish');
const _ = require('lodash');
const { validateMsg } = require('../startup/validation');
const asyncMiddleware = require('../middleware/async-middleware');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const paramsId = require('../middleware/paramsId');

//////////////// staff routes /////////////////

router.get('/new', [autho], asyncMiddleware(async (req, res) => {
    res.render('dishes/newDish');
}));


router.post('/', [autho], asyncMiddleware(async (req, res) => {
    const { error } = validateDish(req.body);
    if (error) return res.status(400).send(validateMsg(error));

    let dish = new Dish(_.pick(req.body, ['name', 'price', 'stock']));
    await dish.save();

    res.redirect('dishes/all');
}));

router.get('/all', [autho], asyncMiddleware(async (req, res) => {
    const dishes = await Dish.find().sort('name');
    
    res.render('dishes/showDishes', { dishes: _.map(dishes, (dish) => _.pick(dish, ['name', 'price'])) });
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