const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('sid');
    res.redirect('/');
  } catch (error) {
    res.end();
  }
});
module.exports = router;
