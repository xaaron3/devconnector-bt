const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');


// @route         GET api/users/test
// @description   tests users route
// @access        public route
router.get('/test', (req, res) => res.json({ msg: 'users works!' }));


// @route         POST api/users/register
// @description   register user
// @access        public
router.post('/register', (req, res) => {
   const { errors, isValid } = validateRegisterInput(req.body);
   // check validation
   if (!isValid) {
      return res.status(400).json(errors)
   }

   User.findOne({ email: req.body.email })
      .then(user => {
         if(user) {
            errors.email = 'Email already exists!!!'
            return res.status(400).json(errors)
         } else {
            const avatar = gravatar.url(req.body.email, {
               s: '200', // Size
               r: 'pg',  // rating
               d: 'mm'   // default
            });

            const newUser = new User({
               name: req.body.name,
               email: req.body.email,
               avatar: avatar,
               password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if(err) throw err;
                  newUser.password = hash;
                  newUser
                     .save()
                     .then(user => res.json(user))
                     .catch(err => console.log(err));
               })
            })
         }
      })
});


// JWT jsonwebtoken module creates token, passport validates and extracts user information from it. 
// @route         GET api/users/login
// @description   Login user / Returning JWT token
// @access        public
router.post('/login', (req, res) => {
   const { errors, isValid } = validateLoginInput(req.body);
   // check validation
   if (!isValid) {
      return res.status(400).json(errors)
   }

   const email = req.body.email;
   const password = req.body.password;

   // Find user by email
   User.findOne({ email }).then(user => {
         // check for user
         if(!user) {
            errors.email = 'User email not found'
            return res.status(404).json(errors)
         }

         // check password
         bcrypt
            .compare(password, user.password)
            .then(isMatch => {
               if(isMatch) {
                  // user matched
                  const payload = { id: user.id, name: user.name, avatar: user.avatar } // Create JWT Payload
                  // Sign Token
                  jwt.sign(
                     payload,
                     keys.secretOrKey, 
                     { expiresIn: 3600 }, 
                     (err, token) => {
                        res.json({
                           success: true,
                           token: 'Bearer ' + token
                        })
                     });
               } else {
                  errors.password = 'Password incorrect!'
                  return res.status(400).json(errors)
               }
            });
      });
});

// @route         GET api/users/current
// @description   Return Current user
// @access        private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
   res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
   }); // displays the user data object on get requests
});

// login with post request to /api/users/login, 
// got token for specific user, 
// access protected route by adding bearer token, 
// responds with user data

module.exports = router;