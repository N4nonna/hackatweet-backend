var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { mimimi } = require('../modules/users')

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* POST SignUp */
router.post('/signup', (req, res) => {
  if (!mimimi(req.body, ['name', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  console.log(1);
  
  // * See if User is already registered * //
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: hash,
        token: uid2(32),
        pp: "https://i.pinimg.com/736x/44/de/75/44de75963e3a5ad52afda0591d6ae989.jpg"
      });

      newUser.save().then(data => {
          res.json({ result: true, token: data.token});
      });
    } else {
      // * User is already registered * //
      res.json({ result: false, error: 'User already registered' });
    }
  });
  console.log(3);
});


/* POST SignIn */

router.post('/signin', (req, res) => {
  if (!mimimi(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
      return ;
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

module.exports = router;
