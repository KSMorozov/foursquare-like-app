var express  = require('express');
var me       = require('./api/me');
var users    = require('./api/users');
var messages = require('./api/messages');
var router   = express.Router();

router.use(me);
router.use(users);
router.use(messages);

module.exports = router;
