var express  = require('express');
var drop     = require('./utils/drop');
var tags     = require('./utils/categories');
var router   = express.Router();

router.use(drop);
router.use(tags);

module.exports = router;
