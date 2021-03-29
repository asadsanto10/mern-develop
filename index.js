const express = require('express');
const dotenv = require('dotenv');
// const bodyParser = require('body-parser');

const app = express();
// db connect
dotenv.config({ path: './.env' });
require('./db/conn');
// const User = require('./modal/userSchema');

// use json to json formate
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// link yo touter file
const auth = require('./router/auth');

app.use(auth);

app.listen(3000, () => {
  console.log('listen on port 3000');
});
