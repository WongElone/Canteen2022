const express = require('express');
const users = require('../routes/users');
const authen = require('../routes/authen');
const dishes = require('../routes/dishes');
const menus = require('../routes/menus');
const controls = require('../routes/controls');
const cookieParser = require('cookie-parser');

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static('public'));

    app.use('/users', users);
    app.use('/authen', authen);
    app.use('/dishes', dishes);
    app.use('/menus', menus);
    app.use('/controls', controls);
}
