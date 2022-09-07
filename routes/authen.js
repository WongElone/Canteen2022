const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { validateMsg } = require('../startup/validation');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/async-middleware');
const url = require('url');
const path = require('path');

router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).redirect(url.format({
        pathname: '/authen/login',
        query: { errMsgs: JSON.stringify(validateMsg(error)) }
    }));

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).redirect(url.format({
        pathname: '/authen/login',
        query: { errMsgs: JSON.stringify(['Incorrect username or password']) }
    }));

    const validPw = await bcrypt.compare(req.body.password, user.password);
    if (!validPw) return res.status(404).redirect(url.format({
        pathname: '/authen/login',
        query: { errMsgs: JSON.stringify(['Incorrect username or password']) }
    }));

    const token = user.generateAuthenToken();
    res.cookie('x_authen_token', token, { httpOnly: true });

    if (user.isStaff) return res.redirect('/controls');
    
    res.redirect('/orders/yourOrders');
}));

router.get('/login', asyncMiddleware((req, res) => {
    res.sendFile(path.join(__dirname, '../public/authen/login.html'));
}));

router.get('/logout', asyncMiddleware((req, res) => {
    res.clearCookie("x_authen_token").redirect('/');
}));

function validate(login) {
    const schema = Joi.object({
        username: Joi.string()
            .pattern(/^[a-zA-Z0-9_\s]*$/)
            .min(3)
            .max(55)
            .required(),

        password: Joi.string()
            .pattern(/^[a-zA-Z0-9_\s]*$/)
            .min(8)
            .max(32)
            .required()
    });

    return schema.validate(login);
}

module.exports = router;