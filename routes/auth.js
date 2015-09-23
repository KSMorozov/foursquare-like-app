var express    = require('express');
var signup     = require('./auth/signup');
var login      = require('./auth/login');
var google     = require('./auth/google');
var unlink     = require('./auth/unlink');
var twitter    = require('./auth/twitter');
var facebook   = require('./auth/facebook');
var instagram  = require('./auth/instagram');
var router     = express.Router();

router.use(instagram);
router.use(facebook);
router.use(twitter);
router.use(google);
router.use(unlink);
router.use(signup);
router.use(login);

module.exports = router;
