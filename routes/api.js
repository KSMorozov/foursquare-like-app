var express  = require('express');
var me       = require('./api/me');
var messages = require('./api/messages');
var router   = express.Router();

router.use(me);
router.use(messages);

module.exports = router;
