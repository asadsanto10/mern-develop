const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// password hash
// eslint-disable-next-line func-names
// userSchema.pre('save', async function (next) {
//   try {
//     const salt = await bcrypt.genSalt(12);
//     const hashPassword = await bcrypt.hash(this.password, salt);
//     const hashConfirmPassword = await bcrypt.hash(this.cPassword, salt);
//     this.password = hashPassword;
//     this.cPassword = hashConfirmPassword;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// generate jwt token
// eslint-disable-next-line func-names
userSchema.methods.generateAuthToken = async function () {
  try {
    // generate token
    const generateToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: generateToken });
    this.save();
    return generateToken;
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model('users', userSchema);
module.exports = User;
