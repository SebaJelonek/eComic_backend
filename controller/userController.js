const jwt = require('jsonwebtoken');
const User = require('../model/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

const maxAge = 3 * 24 * 3600;

let user = process.env.GMAIL_USER.split('');
user.shift();
user.pop();
user.pop();
user = user.join('');
let password = process.env.GMAIL_PASSWORD.split('');
password.pop();
password = password.join('');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: user, pass: password },
});

// creating token with jwt
const createToken = (id, isAdmin, isBanned) => {
  return jwt.sign({ id, isAdmin, isBanned }, process.env.SECRET_1, {
    expiresIn: maxAge,
  });
};

const confirmUser = async (req, res) => {
  const { id } = jwt.verify(req.params.token, process.env.MAIL_SECRET);
  await User.findOneAndUpdate({ _id: id }, { isConfirmed: true });
  return res.redirect('http://localhost:3000/');
};

const confirmEmailToken = (id, email) => {
  return jwt.sign(
    { id },
    process.env.MAIL_SECRET,
    { expiresIn: maxAge },
    (err, emailToken) => {
      const url = `http://localhost:1337/api/user/${emailToken}`;
      transporter.sendMail({
        to: email,
        subject: 'Confirmation Email.',
        text: `Thank you for joining eComicon! Please click the link below in order confirm your e-mail:
        ${url}`,
      });
    }
  );
};

const registerPost = async (req, res) => {
  const { name, email, password } = req.body;
  let message = 'We have sent you a confirmation e-mail';
  try {
    const user = await User.create({ name, password, email });
    const token = createToken(name, user.isAdmin, user.isBanned);
    confirmEmailToken(user._id, email);
    res.json({ status: 'ok', token, name, email, message });
  } catch (error) {
    console.log(error);
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

      //sending res back to client
      res.status(400).json({ status: 'error', message });
    } else {
      message = error.errors.email.properties.message;

      capitalLetter = message[0].toUpperCase();
      message = message.split('');
      message.shift();
      message = message.join('');
      message = capitalLetter.concat(message);

      res.status(400).json({ status: 'error', message });
    }
  }
};

const loginPost = async (req, res) => {
  const { findBy, password } = req.body;
  try {
    const user = await User.login(findBy, password);
    const token = createToken(user.name, false, false);
    res.json({ status: 'ok', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
  loginPost,
  registerPost,
  confirmUser,
};
