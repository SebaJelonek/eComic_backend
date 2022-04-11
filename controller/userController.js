const jwt = require('jsonwebtoken');
const User = require('../model/User');

const maxAge = 3 * 24 * 3600;

// creating token with jwt
const createToken = (id, isAdmin, isBanned) => {
  return jwt.sign({ id, isAdmin, isBanned }, 'secret', { expiresIn: maxAge });
};

const registerPost = async (req, res) => {
  const { name, password, isAdmin } = req.body;
  const user = new User({ name, password, isAdmin });
  try {
    await User.create({ name, password, isAdmin });
    const token = createToken(user.name, user.isAdmin, false);
    res.json({ status: 'ok', token, name, isAdmin });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 'error', error });
  }
};

const loginPost = async (req, res) => {
  const { name, password, isAdmin } = req.body;
  try {
    const user = await User.login(name, password, isAdmin);
    const token = createToken(user.name, user.isAdmin, user.isBanned);
    res.json({ status: 'ok', token, name, isAdmin });
  } catch (error) {
    console.log(error);
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

module.exports = { putBanUser, getUserList, loginPost, registerPost };
