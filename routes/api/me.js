var express = require('express');
var User    = require('../../models/user');
var limit   = require('../middleware/limit');
var router  = express.Router();
var async   = require('async');

router.get('/me', limit, function (req, res) {
  User.findById(req.user, function (err, user) {
    return res.send(user);
  });
});

router.put('/me', limit, function (req, res) {
  User.findById(req.user, function (err, user) {
    if (!user) {
      return res.status(400).send({ message : 'User not found' });
    }
    user.displayName  = req.body.displayName || user.displayName;
    user.email        = req.body.email || user.email;
    user.city         = req.body.city || user.city;
    user.info         = req.body.info || user.info;
    user.sex          = req.body.sex || user.sex;
    user.date         = new Date(req.body.date) || user.date;
    user.save(function (err) {
      res.status(200).end();
    });
  });
});

router.get('/me/friends', limit, function (req, res) {
  User.findById(req.user, function (err, user) {
    if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
    // res.status(200).send(user.friends);
    async.map(user.friends, function (friend, callback) {
      User.findById(friend, function (err, guy) {
        if (err) callback(err);
        else {
          callback(null, {
            friend_id : friend,
            friend_picture : guy.picture,
            friend_name : guy.displayName
          });
        }
      });
    }, function (err, friends_results) {
      if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
      res.status(200).send(friends_results);
    });
  });
});

module.exports = router;
