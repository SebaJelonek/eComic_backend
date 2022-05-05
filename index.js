const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const pasteRoutes = require('./routes/pasteRoutes');
const session = require('express-session');
const Passport = require('passport');

const app = express();
// middleware
app.use(express.json());
app.use(
  cors({ origin: '*', methods: ['GET', 'PUT', 'POST', 'DELETE', 'UPDATE'] })
);
app.use(
  session({
    secret: process.env.SECRET_2,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(Passport.initialize());
app.use(Passport.session());
require('./passportConfig')(Passport);
// DB connection and starting of server
const dbURI =
  'mongodb+srv://user1234:password1234@cluster0.pbmfd.mongodb.net/eComicon?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(process.env.PORT || 1337, () => {
  console.log('i am listing');
});

app.use(userRoutes);
app.use(pasteRoutes);
