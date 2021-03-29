const mongoose = require('mongoose');
// database
// const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.npxlx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const DB = `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connect to database');
  })
  .catch((err) => {
    console.log(`${err}error to database`);
  });
