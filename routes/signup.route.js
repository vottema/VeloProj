const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');

const saltRounds = 3;

const { isSession, isNotSession } = require('../middleware');

router.get('/', (req, res) => {
  res.render('signup');
});
router.post('/', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username, password: hashPassword, email,
    });
    req.session.userId = user.id;
    req.session.username = user.username;
    console.log(req.session);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
