const express = require('express');
const app = express();

require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/validation').joiSetting();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening to port ${port}`));

