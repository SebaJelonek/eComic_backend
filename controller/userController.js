const jwt = require('jsonwebtoken');
const User = require('../model/User');
const nodemailer = require('nodemailer');
const Passport = require('passport');
require('dotenv').config();

const maxAge = 3 * 24 * 3600;
const { SECRET_1, GMAIL_PASSWORD, GMAIL_USER, MAIL_SECRET } = process.env;

//creating transporter via nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // smtp address of gmail
  port: 587, // the usual port for sending emails
  secure: false, // with true it does not work
  auth: { user: GMAIL_USER, pass: GMAIL_PASSWORD },
});

// creating token with jwt
const createToken = (isAdmin, name, email) => {
  return jwt.sign({ isAdmin, name, email }, SECRET_1, {
    expiresIn: maxAge,
  });
};

const confirmUserEmail = async (req, res) => {
  const { id } = jwt.verify(req.params.token, MAIL_SECRET);
  await User.findOneAndUpdate({ _id: id }, { isConfirmed: true });
  return res.redirect('http://localhost:3000/');
};

const confirmEmailToken = (id, email) => {
  return jwt.sign(
    { id },
    MAIL_SECRET,
    { expiresIn: maxAge },
    (err, emailToken) => {
      const url = `http://localhost:1337/api/user/confirm/${emailToken}`;
      transporter.sendMail({
        to: email,
        subject: 'Confirmation Email.',
        text: `Thank you for joining eComicon! Please click the link below in order confirm your e-mail:
        ${url}`,
      });
    }
  );
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  let message = 'Confirmation email has been send, please check your inbox';
  try {
    const user = await User.create({ name, password, email });
    const token = confirmEmailToken(user._id, email);
    res.json({ status: 'ok', token, name, email, message });
  } catch (error) {
    // console.log(error.errors);
    let userName;
    if (error.code === 11000) {
      //splitting array in '{' point
      //taking the second [1] returned array
      //spliting array on single chars
      userName = error.message.split('{')[1].split('');

      userName.shift(); //deleting first char
      userName.pop(); //deleting last char
      userName.pop(); //deleteing last char again

      //creating variable which holds first char as capital latter
      userNameCapital = userName[0].toUpperCase();
      userName.shift(); //deleting first char
      userName = userName.join(''); //joining sigle chars into one string element
      userName = userNameCapital.concat(userName); //joining two arrays together

      // adding additional information at the end
      message = userName + ' is already taken.';
      console.log(message);
      //sending res back to client
      res.status(400).json({ status: 'error', message });
    } else if (error.errors.email !== undefined) {
      // console.log(error.errors);
      message = error.errors.email.properties.message;

      capitalLetter = message[0].toUpperCase();
      message = message.split('');
      message.shift();
      message = message.join('');
      message = capitalLetter.concat(message);
      console.log(message);

      res.status(400).json({ status: 'error', message });
    } else if (error.errors.password !== undefined) {
      res.json({
        status: 400,
        message: error.errors.password.properties.message,
      });
    }
  }
};
// hkm24571@jiooq.com
const login =
  ('/login',
  (req, res, next) => {
    Passport.authenticate('local', (err, user, info) => {
      if (err) {
        throw err;
      }
      if (!user)
        res.json({ status: 400, message: 'Username or password incorrect' });
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          console.log(user);
          res.json({
            msg: 'Successfully Authenticated',
            name: user.name,
            email: user.email,
            isArtist: user.isArtist,
          });
          console.log(req.session);
        });
      }
    })(req, res, next);
  });

// const verify = (req, res, next) => {
//   Passport.authenticate('local', () => {
//     if (!req.isAuthenticated()) {
//       console.log('\nisAuthenticated: ' + req.isAuthenticated() + '\n');
//       res.json({ status: 'is baaad' });
//     } else {
//       console.log(req.session);
//       console.log(req.isAuthenticated());
//       res.json({ status: 'ok' });
//     }
//     console.log('veryfi');
//     console.log(req.session);
//   })(req, res, next);
// };

const justGetRoute = (req, res) => {
  res.send(req.user);
  console.log(req.user);
};

const getUserList = async (req, res) => {
  try {
    const userList = await User.find();
    res.json({ status: 'ok', userList });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const putBanUser = async (req, res) => {
  try {
    const { _id, isAdmin, isBanned } = req.body;
    await User.findOneAndUpdate({ _id }, { isBanned: true });
    const token = createToken(_id, isAdmin, isBanned);
    res.json({ status: 'ok', message: 'user has been banned', token });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  putBanUser,
  getUserList,
  login,
  register,
  confirmUserEmail,
  // verify,
  justGetRoute,
};
