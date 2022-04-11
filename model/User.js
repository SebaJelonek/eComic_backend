const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    isBanned: {
      type: Boolean,
    },
  },
  { collection: 'user' }
);

//using mongoose hooks to hash passwords with bcrypt

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (name, password) {
  const user = await this.findOne({ name });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
  }
  throw Error('Name or password is incorrect');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
