const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const { validateMsg } = require('../startup/validation');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const asyncMiddleware = require('../middleware/async-middleware');
const url = require('url');

router.get('/all', [autho], asyncMiddleware(async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);

    if (error) return res.status(400).redirect(url.format({
        pathname: 'users/new',
        query: {
            errMsgs: [, ...validateMsg(error)]
        }
    }));

    let user = new User(_.pick(req.body, ['username', 'password', 'phone']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save()
        .then(() => {
            const token = user.generateAuthenToken();
            // res.header('x_authen_token', token);
            res.cookie('token', token, { httpOnly: true });
            // res.redirect('users/welcome');
            res.redirect('users/all');
        })
        .catch(() => {
            res.redirect(url.format({
                pathname: 'users/new',
                query: {
                    errMsgs: [,'Username or phone number already taken']
                }
            }));
        });
}));

router.get('/new', asyncMiddleware(async (req, res) => {
    res.render('users/newUser', { query: req.query });
}));

router.get('/welcome', asyncMiddleware(async (req, res) => {
    res.send('New user successfully created.');
}))

module.exports = router;