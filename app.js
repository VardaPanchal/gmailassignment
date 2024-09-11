const express = require('express');
const routes = require('./route');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to Gmail API');
});
