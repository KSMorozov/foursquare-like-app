var express = require('express');
var signup  = require('./auth/signup');
var login   = require('./auth/login');
var router  = express.Router();

router.use(signup);
router.use(login);

module.exports = router;
