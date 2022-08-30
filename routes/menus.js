const express = require('express');
const router = express.Router();
const { Menu, validateMenu } = require('../models/menu');
const _ = require('lodash');
const { validateMsg } = require('../startup/validation');
const asyncMiddleware = require('../middleware/async-middleware');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const { Dish } = require('../models/dish');
const path = require('path');
const url = require('url');

//////////////// staff routes /////////////////

router.post('/', [autho, isStaff], asyncMiddleware(async (req, res) => {
    if (req.body.input_dishes_stringify) {
        req.body.dishesNames = JSON.parse(req.body.input_dishes_stringify);
        delete req.body.input_dishes_stringify;
    }

    const { error } = validateMenu(req.body);

    if (error) return res.status(400).redirect(url.format({
        pathname: '/menus/new',
        query: { errMsgs: JSON.stringify(validateMsg(error)) }
    }));
    
    const dishes = await Dish.find({ name: { $in: req.body.dishesNames } });

    if (dishes.length != req.body.dishesNames.length)
        return res.status(404).send('Some dishes names are not found, please try again');

    let menu = new Menu({
        name: req.body.menuName,
        dishes: dishes.map((dish) => dish._id),
        date: req.body.date
    });

    await menu.save();

    res.sendFile(path.join(__dirname, '../public/menus/newSuccess.html'));
}));

router.get('/new', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/menus/newMenu.html'));
}));

router.get('/showAll', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/menus/showAllMenus.html'));
}));

router.get('/all', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const menus = await Menu.find().sort('name');
    const ms = _.map(menus, (menu) => _.pick(menu, ['_id', 'name', 'date']));

    for (let i in menus) {
        const dishes = await Dish.find({ _id: { $in: menus[i].dishes } });
        ms[i].dishes = _.map(dishes, (dish) => _.pick(dish, ['name', 'price']));
    }

    res.send(ms);
}));

router.get('/deleteMenus', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/menus/deleteMenus.html'));
}));


router.post('/deletes', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const delMenusIds = JSON.parse(req.body.delMenusIds);

    await Menu.deleteMany({ _id: { $in: delMenusIds } });

    res.sendFile(path.join(__dirname, '../public/menus/deleteSuccess.html'));
}));

////////////// customer routes ////////////////

router.get('/today', [autho], asyncMiddleware(async (req, res) => {
    const menus = await Menu.find();

    const hkDate = new Date()
                    .toLocaleString('en-UK', { timeZone: 'Asia/Singapore' })
                    .slice(0,10);

    const todayMenus = [];
    for (let menu of menus) {
        if (menu.date === hkDate) {
            todayMenus.push(menu);
        }
    }

    //////////////// !!! refactor later !!! ////////////////

    const ms = _.map(todayMenus, (menu) => _.pick(menu, ['name', 'date']));

    for (let i in todayMenus) {
        const dishes = await Dish.find({ _id: { $in: todayMenus[i].dishes } });
        ms[i].dishes = _.map(dishes, (dish) => _.pick(dish, ['name', 'price']));
    }

    res.send(ms);
}));

router.get('/showToday', [autho], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/menus/showTodayMenus.html'));
}));

module.exports = router;