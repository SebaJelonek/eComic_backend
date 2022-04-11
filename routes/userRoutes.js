const { Router } = require('express');

// '/api/user/register',
// '/api/admin/ban-user',
// '/api/admin/get-users',
// '/api/user/login',

const {
  putBanUser,
  getUserList,
  loginPost,
  registerPost,
} = require('../controller/userController');

const userRouter = Router();

userRouter.put('/api/admin/ban-user', putBanUser);
userRouter.post('/api/user/login', loginPost);
userRouter.post('/api/user/register', registerPost);
userRouter.get('/api/admin/get-users', getUserList);

module.exports = userRouter;
