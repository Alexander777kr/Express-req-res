const express = require('express');
let router = express.Router();

//router.use works the same way that app.use does, but it's specific to THIS router

//Instead of
//app.get(...)
//we do:
//router.get(...)

router.get('/', (req, res, next) => {
  res.json({
    msg: 'Router works!',
  });
});

module.exports = router;
