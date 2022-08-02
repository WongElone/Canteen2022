const express = require('express');
const app = express();
const users = require('./routes/users');
const authen = require('./routes/authen');

require('./startup/db')();



app.use(express.json());
app.use('/api/users', users);
app.use('/api/authen', authen);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening to port ${port}`));

