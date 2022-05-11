const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const pasteRoutes = require('./routes/pasteRoutes');
const Passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'UPDATE'],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET_2,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
  })
);
app.use(userRoutes);
app.use(pasteRoutes);
app.use(cookieParser(process.env.SECRET_2));
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

app.post('/api/verify', (req, res, next) => {
  Passport.authenticate('local', () => {
    if (!req.isAuthenticated()) {
      console.log('\nisAuthenticated: ' + req.isAuthenticated() + '\n');
      res.json({ status: 'is baaad' });
    } else {
      console.log(req.session);
      console.log(req.isAuthenticated());
      res.json({ status: 'ok' });
    }
    console.log('veryfi');
    console.log(req.session);
  })(req, res, next);
});

app.listen(process.env.PORT || 1337, () => {
  console.log('i am listing');
});
