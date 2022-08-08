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
} = require('../controller/userController');

const userRouter = Router();

userRouter.get('/api/user/confirm/:token', confirmUserEmail);
userRouter.post('/api/user/login', login);
userRouter.post('/api/user/register', register);
userRouter.get('/api/verify', verify);

module.exports = userRouter;
