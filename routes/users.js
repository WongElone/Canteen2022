const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const { validateMsg } = require('../startup/validation');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const asyncMiddleware = require('../middleware/async-middleware');
const url = require('url');
const querystring = require('../functions/querystring');
const path = require('path');

router.get('/all', [autho, isStaff], asyncMiddleware(async (req, res) => {
    const users = await User.find({ isStaff: false }).sort('name');
    res.render('users/showUsers', { users: _.map(users, (user) => _.pick(user, ['username', 'phone'])) });
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);

    if (error) return res.status(400).redirect(url.format({
        pathname: '/users/new',
        query: {
            // errMsgs: [, ...validateMsg(error)]
            errMsgs: querystring.arr2param(validateMsg(error))
        }
    }));

    let user = new User(_.pick(req.body, ['username', 'password', 'phone']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save()
        .then(() => {
            const token = user.generateAuthenToken();
            // res.header('x_authen_token', token);
            res.cookie('x_authen_token', token, { httpOnly: true })
                .redirect('users/welcome');
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
    // res.render('users/newUser', { query: req.query });
    res.sendFile(path.join(__dirname, '../public/users/newUser.html'));
}));

router.get('/welcome', [autho], asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.userPayload._id);
    res.render('users/welcome', { user: _.pick(user, ['username', 'isStaff']) });
}));

module.exports = router;