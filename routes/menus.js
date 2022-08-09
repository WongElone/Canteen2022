const express = require('express');
const router = express.Router();
const { Menu, validateMenu, validateMenuPut } = require('../models/menu');
const _ = require('lodash');
const { validateMsg } = require('../startup/validation');
const asyncMiddleware = require('../middleware/async-middleware');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const paramsId = require('../middleware/paramsId');
const { Dish } = require('../models/dish');

//////////////// staff routes /////////////////

router.post('/', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const { error } = validateMenu(req.body);
    if (error) return res.status(400).send(validateMsg(error));

    const dishes = [];
    for (let id of req.body.dishesId) {
        const dish = await Dish.findById(id);
        if (!dish) return res.status(404).send(`The dish with the given ID: ${curr} was not found.`);

        dishes.push(dish);
    }

    let menu = new Menu({
        name: req.body.name,
        dishes: dishes,
        date: req.body.date
    });

    await menu.save();

    res.send(menu);
}));

router.get('/', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const menus = await Menu.find().sort('name');

    res.send(menus);
}));

router.get('/menu/:id', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).send('The dish with the given ID was not found.');

    res.send(menu);
}));

router.put('/menu/:id', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
    const { error } = validateMenuPut(req.body);
    if (error) return res.status(400).send(validateMsg(error));

    let menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).send('The dish with the given ID was not found.');

    for (let key in req.body) {
        if (key === 'dishesId') {
            const dishes = [];
            for (let id of req.body.dishesId) {
                const dish = await Dish.findById(id);
                if (!dish) return res.status(404).send(`The dish with the given ID: ${curr} was not found.`);
        
                dishes.push(dish);
            }

            menu.dishes = dishes;
        }
        else
            menu[key] = req.body[key];
    }

    await menu.save();
    
    res.send(menu);
}));

router.delete('/menu/:id', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
    const menu = await Menu.findByIdAndRemove(req.params.id);
    if (!menu) return res.status(404).send('The dish with the given ID was not found.');

    res.send(menu);
}));

////////////// customer routes ////////////////

router.get('/today', [autho], asyncMiddleware(async (req, res) => {
    console.log('asdfasdf');
    const menus = await Menu.find();

    const hkDate = new Date()
                    .toLocaleString('en-UK', { timeZone: 'Asia/Singapore' })
                    .slice(0,10);

    const todayMenus = []
    for (let menu of menus) {
        if (menu.date === hkDate) {
            todayMenus.push(menu);
        }
    }

    res.send(todayMenus);
}));

module.exports = router;