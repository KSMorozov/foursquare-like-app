var express = require('express');
var router  = express.Router();

var login    = require('./login');
var signup   = require('./signup');
var google   = require('./google');

router.use('/login' , login);
router.use('/signup', signup);
router.use('/google', google);

module.exports = router;
