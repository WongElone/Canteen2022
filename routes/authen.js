const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { validateMsg } = require('../startup/validation');
const Joi = require('joi');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(validateMsg(error));

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).send('Invalid username or password.');

    const validPw = await bcrypt.compare(req.body.password, user.password);
    if (!validPw) return res.status(400).send('Invalid username or password.');

    const token = user.generateAuthenToken();
    res.header('x-authen-token', token).send("Successfully login.");
});

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