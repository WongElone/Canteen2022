const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const { validateMsg } = require('../startup/validation');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    let users = await User.find().sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);

    if (error) return res.status(400).send(validateMsg(error));

    let user = new User(_.pick(req.body, ['username', 'password', 'phone']));
    
    const salt = await bcrypt.genSalt(10); // later put salt in envrionment variable
    user.password = await bcrypt.hash(user.password, salt);

    await user.save()
        .then(() => {
            const token = user.generateAuthenToken();
            res.header('x-auth-token', token).send('New user successfully created.');
        })
        .catch(() => res.send('Username or phone number already taken.'));
});

module.exports = router;