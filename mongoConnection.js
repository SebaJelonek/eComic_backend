const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, (err, res) => {
  err && console.log(err);
  try {
    console.log('DataBase Conneted!');
  } catch (err) {
    console.log('Error: ' + err);
  }
});
