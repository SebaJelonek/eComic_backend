const jwt = require('jsonwebtoken');
const User = require('../model/User');
const nodemailer = require('nodemailer');
const Passport = require('passport');
require('dotenv').config();

const maxAge = 3 * 24 * 3600;
const { SECRET_1, GMAIL_PASSWORD, GMAIL_USER, MAIL_SECRET } = process.env;

//creating transporter via nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
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
      userName.pop(); //deleting last char again

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
          const { name, email, isAdmin, isArtist, _id, favoriteList } = user;
          if (err) throw err;
          console.log('login route: ');
          console.log(user);
          res.json({
            msg: 'Successfully Authenticated',
            name,
            email,
            isArtist,
            id: _id,
            favoriteList,
            isAdmin,
          });
          console.log('login route session: ');
          console.log(req.session);
        });
      }
    })(req, res, next);
  });

const verify = (req, res, next) => {
  console.log('verify session: ');
  Passport.authenticate('local', (err, user, info) => {
    console.log(req.session);
  });
};

const addToFavorite = async (req, res) => {
  const userId = req.body.userId;
  const comicId = req.body.comicId;
  let user = await User.findById(userId);
  let favoriteList = user.favoriteList;
  let message = '';

  if (favoriteList.includes(comicId)) {
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { favoriteList: comicId } }
    );
    message = 'Comic has been deleted from favorite list';
  } else {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { favoriteList: comicId } }
    );
    message = 'Comic has been added to favorite list';
  }

  user = await User.findById(userId);
  favoriteList = user.favoriteList;

  res.status(200).json({ message, favoriteList });
};

module.exports = {
  login,
  register,
  confirmUserEmail,
  verify,
  addToFavorite,
};
