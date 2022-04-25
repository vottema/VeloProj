const express = require('express');

const router = express.Router();
const { Route } = require('../db/models');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { a, b } = req.query;
  const card = await Route.findByPk(id);
  if (!a && !b) {
    res.redirect(`/info/${id}?a=${card.pointA}&b=${card.pointB}`);
  } else {
    res.render('info', {
    // eslint-disable-next-line max-len
      title: card.nameRoute, author: card.author, pointA: card.pointA, pointB: card.pointB, lengthRoute: card.lengthRoute, timeRoute: card.timeRoute, description: card.description,
    });
  }
});

module.exports = router;
