const express = require('express');
let router = express.Router();

//Instead of
//app.get(...)
//we do:
//router.get(...)

function validateUser(req, res, next) {
  res.locals.validated = true;
  console.log('validated');
  next();
}
//validateUser is middleware that will ONLY be added to THIS router.
router.use(validateUser);

router.get('/', (req, res, next) => {
  res.json({
    msg: 'User Router works!',
  });
});

module.exports = router;
