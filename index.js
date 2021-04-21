const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
);

// use json to json formate
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// db connect
dotenv.config({ path: './.env' });
require('./db/conn');
// const User = require('./modal/userSchema');

// link router file
const auth = require('./router/auth');

app.use(auth);

app.listen(5000, () => {
  console.log('listen on port 5000');
});
