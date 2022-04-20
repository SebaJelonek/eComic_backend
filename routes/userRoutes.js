const { Router } = require('express');

// '/api/user/register',
// '/api/admin/ban-user',
// '/api/admin/get-users',
// '/api/user/login',

const {
  putBanUser,
  getUserList,
  login,
  registerPost,
  confirmUser,
} = require('../controller/userController');

const userRouter = Router();

userRouter.get('/api/user/confirm/:token', confirmUser);
userRouter.put('/api/admin/ban-user', putBanUser);
userRouter.get('/api/user/:token', login);
userRouter.post('/api/user/register', registerPost);
userRouter.get('/api/admin/get-users', getUserList);

module.exports = userRouter;
