const { Router } = require('express');

// '/api/user/register',
// '/api/admin/ban-user',
// '/api/admin/get-users',
// '/api/user/login',

const {
  login,
  register,
  confirmUserEmail,
  verify,
  addToFavorite,
} = require('../controller/userController');

const userRouter = Router();

userRouter.get('/api/user/confirm/:token', confirmUserEmail);
userRouter.post('/api/user/login', login);
userRouter.post('/api/user/register', register);
userRouter.post('/api/user/add-favorite', addToFavorite);
userRouter.get('/api/verify', verify);

module.exports = userRouter;
