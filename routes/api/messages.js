var express  = require('express');
var mongoose = require('mongoose');
var Message  = require('../../models/message');
var limit    = require('../middleware/limit');
var User     = require('../../models/user');
var router   = express.Router();
var async    = require('async');

router.post('/messages', limit, function (req, res) {
  var message = new Message({
    from    : mongoose.Types.ObjectId(req.user),
    to      : mongoose.Types.ObjectId(req.body.user),
    body    : req.body.body
  });

  message.save(function (err, message) {
    if (err) return res.send({ message : 'Не удалось отправить сообщение.' });
    User.findById(req.user, function (err, user) {
      message.set('sender',
                  { id : user._id, name : user.displayName, picture : user.picture },
                  { strict : false });
      if (err) return res.send({ message : 'Не удалось отправить сообщение.' });
      res.send(message);
    });
  });
});

router.get('/messages/chats', limit, function (req, res) {
  var amount = 1;
  var me_id  = req.user;
  User.findById(me_id, function (err, me) {
    if (err) return res.status(500).send({ message : 'Произошла Ошибка.' });
    var friends = me.friends;
    chats = [];

    async.each(
    friends,
    function (friend, callback) {
      Message.find({
        $or : [
          { to : me._id, from : friend },
          { to : friend, from: me._id }
        ]
      }).sort('+date').limit(amount).exec(function (err, last_message) {
        if (err) callback(err);
        User.findById(friend, function (err, friend) {
          if (err) callback(err);
          else {
            chats.push({
              message : last_message.pop(),
              friend  : {
                id : friend._id,
                name : friend.displayName,
                picture : friend.picture
              }
            });
            callback();
          }
        });
      });
    },
    function (err) {
      if (err) return res.status(404).send({ message : 'Не удалось найти сообщения.' });
      res.status(200).send(chats);
    });
  });
});

router.get('/messages/chat', limit, function (req, res) {
  var amount = req.query.amount || 20;
  var skip   = req.query.skip || 0;
  var user   = req.query.user;
  if (!user) return res.status(400).send({ message : 'Пользователь не был указан.' });
  Message.find({
    $or : [
      { to : req.user, from : user },
      { to : user, from: req.user }
    ]
  }).sort('+date').limit(amount).exec(function (err, messages) {
    if (!messages.length) return res.status(404).send({ message : 'У вас пока нету сообщений с этим пользователем.' });
    async.map(
      messages,
      function (message, callback) {
        User.findById(message.from, function (err, user) {
          if (err) callback(err);
          else {
            message.set('sender', { id : user._id, name : user.displayName, picture : user.picture }, {strict: false});
            callback(null, message);
          }
        });
      },
      function (err, messages_result) {
        if (err) return res.status(404).send({ message : 'Не удалось найти сообщения.' });
        res.status(200).send(messages_result);
      }
    );
  });
});

router.get('/messages/:id', limit, function (req, res) {
  Message.findById(req.params.id, function (err, message) {
    if (err) return res.status(404).send({ message : 'No Such Message Found!' });
    res.send(message);
  });
});

module.exports = router;
