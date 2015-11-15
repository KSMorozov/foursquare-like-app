var express  = require('express');
var User     = require('../../models/user');
var Invite   = require('../../models/invite');
var Meeting  = require('../../models/meeting');
var Message  = require('../../models/message');
var Category = require('../../models/category');
var Comment  = require('../../models/comment');
var async    = require('async');

var router  = express.Router();

// drop users collection
router.delete('/users/drop', function (req, res) {
  User.remove({}, function (err) {
    return res.status(200).send({ message : 'collection flushed.' });
  });
});

// drop meetings collection
router.delete('/meetings/drop', function (req, res) {
  Meeting.remove({}, function (err) {
    return res.status(200).send({ message : 'collection flushed.' });
  });
});

// drop messages collection
router.delete('/messages/drop', function (req, res) {
  Message.remove({}, function (err) {
    return res.status(200).send({ message : 'collection flushed.' });
  });
});

// drop categories collection
router.delete('/categories/drop', function (req, res) {
  Category.remove({}, function (err) {
    return res.status(200).send({ message : 'collection flushed.' });
  });
});

// drop comments collection
router.delete('/comments/drop', function (req, res) {
  Comment.remove({}, function (err) {
    return res.status(200).send({ message : 'collection flushed.' });
  });
});

router.delete('/invites/drop', function (req, res) {
  Invite.remove({}, function (err) {
    return res.status(200).send({ message : 'collection flushed.' });
  });
});

router.delete('/all/drop', function (req, res) {
  async.each(
  [User, Meeting, Message, Category, Comment, Invite],
  function (schema, callback) {
    schema.remove({}, function (err) {
      if (err) callback(err);
    });
  },
  function (err) {
    if (err) res.status(500).send({ message : 'failed to flush collection.' });
    return res.status(200).send({ message : 'collections flushed.' });
  });
});

module.exports = router;
