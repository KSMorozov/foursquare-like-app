var express  = require('express');
var me       = require('./api/me');
var users    = require('./api/users');
var invites  = require('./api/invites');
var uploads  = require('./api/uploads');
var meetings = require('./api/meetings');
var messages = require('./api/messages');
var comments = require('./api/comments');
var router   = express.Router();

router.use(me);
router.use(users);
router.use(invites);
router.use(uploads);
router.use(meetings);
router.use(messages);
router.use(comments);

module.exports = router;
