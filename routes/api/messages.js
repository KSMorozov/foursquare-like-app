var express = require('express');
var Message = require('../../models/message');
var limit   = require('../middleware/limit');
var router  = express.Router();

router.post('/messages', limit, function (req, res) {
  var message = new Message({
    from    : req.user,
    to      : req.body.friend,
    subject : req.body.subject,
    body    : req.body.body
  });

  message.save(function (err) {
    if (err) return res.send(err);
    res.json({
      message : 'New Message Sent!',
      id      : message._id
    });
  });
});

router.get('/messages', limit, function (req, res) {
  var inbox  = Message.find({ to : req.user, from : req.body.friend });
  var outbox = Message.find({ to : req.body.friend, from : req.user });
  inbox.concat(outbox)
  .sort('-date')
  .exec(function (err, messages) {
    if (err) return res.status(404).send({ message : 'No Messages Found.' });
    res.json(messages);
  });
});

router.get('/messages/:_id', limit, function (req, res) {
  Message.findOne({ _id : req.params._id }, function (err, message) {
    if (err) return res.status(404).send({ message : 'No Such Message Found!' });
    res.json(message);
  });
});

module.exports = router;
