var express  = require('express');
var me       = require('./api/me');
var users    = require('./api/users');
var uploads   = require('./api/uploads');
var messages = require('./api/messages');
var router   = express.Router();

router.use(me);
router.use(users);
router.use(uploads);
router.use(messages);

module.exports = router;
