const express = require('express');
const cors = require('cors');
require('./mongoConnection');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/fileRoutes');
const comicRoutes = require('./routes/comicRoutes');
const session = require('express-session');
const Passport = require('passport');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

const app = express();
// middleware

///////////////////////////////////////////////////////
//        DB connection and starting of server      //
//////////////////////////////////////////////////////

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
    // cookie: {
    //   secure: true,
    // },
  })
);
app.use(cookieParser(process.env.SECRET_2));
app.use(Passport.initialize());
app.use(Passport.session());
require('./passportConfig')(Passport);
app.use(userRoutes);
app.use(uploadRoutes);
app.use(comicRoutes);

app.listen(process.env.PORT || 1337, () => {
  console.log('i am listing');
});
