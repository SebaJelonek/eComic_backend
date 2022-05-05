const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      validate: [isEmail, 'invalid email'],
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { collection: 'user' }
);

//using mongoose hooks to hash passwords with bcrypt

//before saving user to the database
//we hash the password, in order to protect them on the database itself
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// creating login function
// it is going to be use in order to verify users
userSchema.statics.login = async function (findBy, password) {
  // email: melo@gmail.com
  // name: evnskavbjj
  let user;
  //if findBy includes @ check for user by email
  //else check for user by name
  if (findBy.includes('@')) {
    user = await this.findOne({ email: findBy });
  } else {
    user = await this.findOne({ name: findBy });
  }
  let message;
  //if user is not found send a message
  if (user === null) {
    message = 'Wrong email and/or password';
    return message;
  }
  // if user did not confirm his email send message
  else if (!user.isConfirmed) {
    message = 'You need to confirm your e-mail address first';
    return message;
  }
  // if user is found
  // compare received password to user password
  else {
    const auth = await bcrypt.compare(password, user.password);
    // if auth is true return user
    if (auth) {
      return user;
    } else {
      message = 'Name or password is incorrect';
      return message;
    }
  }
};

const User = mongoose.model('user', userSchema);

module.exports = User;
