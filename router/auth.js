/**
 * Name: user reg api
 * Description: user chek to database if he valid or not
 * Date: 28-03-21
 */

const express = require('express');
// express router
const router = express.Router();
const bcrypt = require('bcryptjs');

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
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, cPassword } = req.body;
    if (name && email && phone && password && cPassword) {
      if (password === cPassword) {
        // *** check emila to already exist
        const userExists = await User.findOne({ email });
        if (!userExists) {
          const user = new User({
            name,
            email,
            phone,
            password,
            cPassword,
          });
          await user.save();
          res.status(201).json({ message: 'user register sucessfully' });
        } else {
          res.status(400).json({ error: 'email already exists ' });
        }
      } else {
        res.status(401).json({ error: 'password do not match' });
      }
    } else {
      res.status(400).json({ error: 'Please all input filled properly' });
    }
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
        if (matchPassword) {
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
