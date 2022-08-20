const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { validateMsg } = require('../startup/validation');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/async-middleware');
const url = require('url');

router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);

    // if (error) return res.status(400).send(validateMsg(error));
    if (error) return res.status(400).redirect(url.format({
        pathname: 'authen/login',
        query: { errMsgs: [, ...validateMsg(error)] }
    }));

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).redirect(url.format({
        pathname: 'authen/login',
        query: { errMsgs: [, 'Incorrect username or password'] }
    }));

    const validPw = await bcrypt.compare(req.body.password, user.password);
    if (!validPw) return res.status(404).redirect(url.format({
        pathname: 'authen/login',
        query: { errMsgs: [, 'Invalid username or password'] }
    }));

    const token = user.generateAuthenToken();
    res.cookie('x_authen_token', token, { httpOnly: true });

    res.redirect('/users/welcome');
}));

router.get('/login', asyncMiddleware((req, res) => {
    res.render('authen/login', { query: req.query });
}));

router.get('/logout', asyncMiddleware((req, res) => {
    res.clearCookie("x_authen_token").redirect('/authen/login');
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