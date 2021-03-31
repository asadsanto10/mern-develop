/**
 * Name: user reg api
 * Description: user chek to database if he valid or not
 * Date: 28-03-21
 */

const express = require('express');
// express router
const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');

require('../db/conn');
const User = require('../modal/userSchema');

router.get('/', (req, res) => {
  res.send('hello world');
  // next();
});
// ? = = = = = == = usning promise ==================
// router.post('/register', (req, res) => {
//   const { name, email, phone, password, cPassword } = req.body;
//   if (name && email && phone && password && cPassword) {
//     // check emila to already exist
//     User.find({ email })
//       .then((userExists) => {
//         console.log(userExists.email);
//         if (!userExists) {
//           console.log(userExists);
//           const user = new User({
//             name,
//             email,
//             phone,
//             password,
//             cPassword,
//           });
//           user
//             .save()
//             .then((created) => {
//               // console.log(created);
//               res.status(201).json({ message: 'user register sucessfully', create: created });
//             })
//             .catch((err) => {
//               res.status(500).json({ message: `fail register${err}` });
//             });
//         } else {
//           res.status(400).json({ error: 'Email already exist' });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   } else {
//     res.status(400).json({ error: 'Please all input filled properly' });
//   }

//   // next();
// });

// validate Schema

const schema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  phone: Joi.number().min(6).required(),
  password: Joi.string().min(6).required(),
  cPassword: Joi.ref('password'),
});

// ? async await function
//  register auth
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, cPassword } = req.body;
    if (!name && !email && !phone && !password && !cPassword) {
      res.status(400).json({ error: 'Please all input filled properly' });
    }
    // if (!password === cPassword) {
    //   res.status(401).json({ error: 'password do not match' });
    // }

    // validate joi
    const { error } = schema.validate(req.body);
    if (error) {
      res.send(error.details[0].message);
    }

    // *** check emila to already exist
    const userExists = await User.findOne({ email });
    if (!userExists) {
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(password, salt);
      const user = new User({
        name,
        email,
        phone,
        password: hashPassword,
        cPassword: hashPassword,
      });
      await user.save();
      res.status(201).json({ message: 'user register sucessfully' });
    } else {
      res.status(400).json({ error: 'email already exists ' });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// login auth
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const userLogin = await User.findOne({ email });
      if (userLogin) {
        const matchPassword = await bcrypt.compare(password, userLogin.password);
        // console.log(password);
        // console.log(userLogin.password);
        console.log(matchPassword);
        if (matchPassword) {
          // json web token
          const authToken = await userLogin.generateAuthToken();
          // console.log(authToken);

          // set cookie authToken
          res.cookie('jwtoken', authToken, {
            expires: new Date(Date.now() + 2589000000),
            httpOnly: true,
          });
          res.status(200).json({ message: 'user login sucessfully', user: userLogin });
        } else {
          res.status(402).json({ error: 'Authentication failed password' });
        }
      } else {
        res.status(402).json({ error: 'Authentication failed' });
      }
    } else {
      res.status(401).json({ error: 'Please all input filled properly' });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
