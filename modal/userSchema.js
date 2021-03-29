const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cPassword: {
    type: String,
    required: true,
  },
});

// password hash
// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(this.password, salt);
    const hashConfirmPassword = await bcrypt.hash(this.cPassword, salt);
    this.password = hashPassword;
    this.cPassword = hashConfirmPassword;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('users', userSchema);
module.exports = User;
