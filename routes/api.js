var express = require('express');
var me      = require('./api/me');
var router  = express.Router();

router.use(me);

module.exports = router;
