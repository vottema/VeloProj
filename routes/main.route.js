const express = require('express');

const router = express.Router();

const { Route } = require('../db/models');

router.get('/', async (req, res) => {
  const card = await Route.findAll();
  res.render('main', { card });
});

module.exports = router;
