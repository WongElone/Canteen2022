const express = require('express');
const app = express();
const users = require('./routes/users');
const authen = require('./routes/authen');
const dishes = require('./routes/dishes');
const menus = require('./routes/menus');
const Joi = require('joi');

require('./startup/config')();
require('./startup/db')();
require('./startup/validation').joiSetting();


app.use(express.json());
app.use('/api/users', users);
app.use('/api/authen', authen);
app.use('/api/dishes', dishes);
app.use('/api/menus', menus);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening to port ${port}`));

