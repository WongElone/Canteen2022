require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/validation').joiSetting();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));

