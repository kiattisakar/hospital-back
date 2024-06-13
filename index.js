// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/userRoutes'); // เส้นทางที่ถูกต้องของ userRoutes

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
