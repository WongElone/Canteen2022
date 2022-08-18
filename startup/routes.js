const express = require('express');
const users = require('../routes/users');
const authen = require('../routes/authen');
const dishes = require('../routes/dishes');
const menus = require('../routes/menus');

module.exports = function(app) {
    app.use(express.json());

    app.use('/api/users', users);
    app.use('/api/authen', authen);
    app.use('/api/dishes', dishes);
    app.use('/api/menus', menus);
}
