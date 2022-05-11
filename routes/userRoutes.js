const { Router } = require('express');

// '/api/user/register',
// '/api/admin/ban-user',
// '/api/admin/get-users',
// '/api/user/login',

const {
  putBanUser,
  getUserList,
  login,
  register,
  confirmUserEmail,
  // verify,
  justGetRoute,
} = require('../controller/userController');

const userRouter = Router();

userRouter.get('/api/user/confirm/:token', confirmUserEmail);
userRouter.put('/api/admin/ban-user', putBanUser);
userRouter.post('/api/user', login);
// userRouter.post('/api/verify', verify);
userRouter.get('/api/just', justGetRoute);
userRouter.post('/api/user/register', register);
userRouter.get('/api/admin/get-users', getUserList);

module.exports = userRouter;
