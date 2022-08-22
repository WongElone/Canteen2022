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
const path = require('path');

//////////////// staff routes /////////////////

router.post('/', [autho, isStaff], asyncMiddleware(async (req, res) => {
    if (req.body.input_dishes_stringify) {
        req.body.dishesNames = JSON.parse(req.body.input_dishes_stringify);
        delete req.body.input_dishes_stringify;
    }

    const { error } = validateMenu(req.body);
    if (error) return res.status(400).send(validateMsg(error));
    
    const dishes = await Dish.find({ name: { $in: req.body.dishesNames } });

    if (dishes.length != req.body.dishesNames.length)
        return res.status(404).send('Some dishes names are not found, please try again');

    let menu = new Menu({
        name: req.body.menuName,
        dishes: dishes.map((dish) => dish._id),
        date: req.body.date
    });

    await menu.save();

    // res.sendFile(path.join(__dirname, '../public/menus/showMenus.html'));
    res.send(menu);
}));

router.get('/new', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/menus/newMenu.html'));
}));

router.get('/showAll', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/menus/showAllMenus.html'));
}));

router.get('/all', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const menus = await Menu.find().sort('name');
    const ms = _.map(menus, (menu) => _.pick(menu, ['name', 'date']));

    for (let i in menus) {
        const dishes = await Dish.find({ _id: { $in: menus[i].dishes } });
        ms[i].dishes = _.map(dishes, (dish) => _.pick(dish, ['name', 'price']));
    }

    res.send(ms);
}));

// router.get('/menu/:id', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
//     const menu = await Menu.findById(req.params.id);
//     if (!menu) return res.status(404).send('The dish with the given ID was not found.');

//     res.send(menu);
// }));

// router.put('/menu/:id', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
//     const { error } = validateMenuPut(req.body);
//     if (error) return res.status(400).send(validateMsg(error));

//     let menu = await Menu.findById(req.params.id);
//     if (!menu) return res.status(404).send('The dish with the given ID was not found.');

//     for (let key in req.body) {
//         if (key === 'dishesId') {
//             const dishes = [];
//             for (let id of req.body.dishesId) {
//                 const dish = await Dish.findById(id);
//                 if (!dish) return res.status(404).send(`The dish with the given ID: ${curr} was not found.`);
        
//                 dishes.push(dish);
//             }

//             menu.dishes = dishes;
//         }
//         else
//             menu[key] = req.body[key];
//     }

//     await menu.save();
    
//     res.send(menu);
// }));

// router.delete('/menu/:id', [autho, isStaff, paramsId], asyncMiddleware(async (req, res) => {
//     const menu = await Menu.findByIdAndRemove(req.params.id);
//     if (!menu) return res.status(404).send('The dish with the given ID was not found.');

//     res.send(menu);
// }));

////////////// customer routes ////////////////

// router.get('/today', [autho], asyncMiddleware(async (req, res) => {
//     console.log('asdfasdf');
//     const menus = await Menu.find();

//     const hkDate = new Date()
//                     .toLocaleString('en-UK', { timeZone: 'Asia/Singapore' })
//                     .slice(0,10);

//     const todayMenus = []
//     for (let menu of menus) {
//         if (menu.date === hkDate) {
//             todayMenus.push(menu);
//         }
//     }

//     res.send(todayMenus);
// }));

module.exports = router;