/**
 * Name: user reg api
 * Description: user chek to database if he valid or not
 * Date: 28-03-21
 */

const express = require('express');
// express router
const router = express.Router();
const bcrypt = require('bcryptjs');
const { registerValidators, loginValidators } = require('../validate/validate');

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

// ? async await function
//  register auth
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // validate joi
    const { error } = await registerValidators(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0] });
    }

    // *** check email to already exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({ error: 'email already exists' });
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      phone,
      password: hashPassword,
    });

    await user.save();
    res.status(201).json({ message: 'user register sucessfully' });
  } catch (err) {
    console.log(err);
  }
});

// login auth
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      // validate joi
      const { error } = await loginValidators(req.body);
      if (!error) {
        const userLogin = await User.findOne({ email });
        if (userLogin) {
          const matchPassword = await bcrypt.compare(password, userLogin.password);

          if (matchPassword) {
            // json web token
            const authToken = await userLogin.generateAuthToken();
            console.log(authToken);

            // set cookie authToken
            res.cookie('jwtoken', authToken, {
              expires: new Date(Date.now() + 2589000000),
              httpOnly: true,
            });
            // console.log('cooki', req.cookies);
            res.status(200).json({ success: 'user login sucessfully' });
          } else {
            res.status(402).json({ error: 'Authentication failed password' });
          }
        } else {
          res.status(402).json({ error: 'Authentication failed email' });
        }
      } else {
        res.status(400).json({ error: error.details[0].message });
      }
    } else {
      res.status(401).json({ error: 'All field is required' });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
