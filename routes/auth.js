var express = require('express');
var signup  = require('./auth/signup');
var login   = require('./auth/login');
var google  = require('./auth/google');
var router  = express.Router();

router.use(signup);
router.use(google);
router.use(login);

module.exports = router;
