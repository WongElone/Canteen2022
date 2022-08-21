const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/async-middleware');
const autho = require('../middleware/autho');
const isStaff = require('../middleware/is-staff');
const path = require('path');

router.get('/', [autho, isStaff], asyncMiddleware(async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/staff/controlpanel.html'));
}));

module.exports = router;