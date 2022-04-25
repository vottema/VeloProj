const express = require('express');

const router = express.Router();
const { Route } = require('../db/models'); // route

router.get('/', (req, res) => {
  res.render('add');
});

router.post('/', async (req, res) => {
  const {
    nameRoute, author, pointA, pointB, lengthRoute, timeRoute, description,
  } = req.body;

  console.log(nameRoute, author, pointA, pointB, lengthRoute, timeRoute, description);
  const { userId } = req.session;
  await Route.create({
    user_id: userId, nameRoute, author, pointA, pointB, lengthRoute, timeRoute, description,
  });
  res.redirect('/');
});

module.exports = router;
