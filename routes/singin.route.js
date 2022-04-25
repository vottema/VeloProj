const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const { isSession, isNotSession } = require('../middleware');

router.get('/', (req, res) => {
  res.render('signin');
});
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      where: { username },
      raw: true,
    });
    if (!user) {
      throw Error('No such login');
    }
    if (!password) {
      throw Error('No such password');
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    console.log(user);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('signin');
  }
});

module.exports = router;
