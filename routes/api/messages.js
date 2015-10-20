var express  = require('express');
var mongoose = require('mongoose');
var Message  = require('../../models/message');
var limit    = require('../middleware/limit');
var router   = express.Router();

router.post('/messages', limit, function (req, res) {
  var message = new Message({
    from    : mongoose.Types.ObjectId(req.user),
    to      : mongoose.Types.ObjectId(req.body.user_id),
    body    : req.body.body
  });

  message.save(function (err) {
    if (err) return res.send(err);
    res.json({
      message : 'New Message Sent!',
      id      : message
    });
  });
});

router.post('/messages/chats', limit, function (req, res) {
  var amount = req.body.amount || 20;
  console.log(amount, req.body.friend);
  Message.find({
    $or: [
      { to : req.user, from : req.body.friend },
      { to : req.body.friend, from : req.user }
    ]
  })
  .sort('-date')
  .limit(amount)
  .exec(function (err, messages) {
    if (err) return res.status(404).send({ message : 'No Messages Found.' });
    res.send(messages);
  });
});

router.get('/messages/:id', limit, function (req, res) {
  Message.findById(req.params.id, function (err, message) {
    if (err) return res.status(404).send({ message : 'No Such Message Found!' });
    res.send(message);
  });
});

module.exports = router;
