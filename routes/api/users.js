var User    = require('../../models/user');
var limit   = require('../middleware/limit');
var express = require('express');
var router  = express.Router();
var async = require('async');

// list followers
router.get('/users/followers', limit, function (req, res) {
var user_id = req.query.id;
  if (!user_id) return res.status(400).send({ message : 'No user id provided with request.' });
  User.findById(user_id, function (err, user) {
    if (!user) return res.status(404).send({ message : 'No user found.'});
    res.send(user.followers);
  });
});

// list friends
router.get('/users/friends', limit, function (req, res) {
  var user_id = req.query.id;
  if (!user_id) return res.status(400).send({ message : 'No user id provided with request.' });
  User.findById(user_id, function (err, user) {
    if (!user) return res.status(404).send({ message : 'No user found.'});
    var friends = [];
    async.each(user.friends, function (friend, callback) {
      User.findById(friend, function (err, guy) {
        if (err) callback(err);
        else {
          friends.push({
            id : friend,
            name : guy.displayName,
            picture : guy.picture
          });
          callback();
        }
      });
    }, function (err) {
      if (err) return res.status(500).send({ message : 'Не удалось найти друзей :(.' });
      res.status(200).send(friends);
    });
  });
});

router.get('/users/:id', limit, function (req, res) {
  var user_id = req.params.id;
  if (!user_id) return res.status(400).send({ message : 'No user id provided with request.' });
  User.findById(user_id, function (err, user) {
    if (!user) return res.status(404).send({ message : 'No User Found.' });
    res.send(user);
  });
});

// make a friend/follow person
router.post('/users/friend', limit, function (req, res) {
  var user_id = req.body.id;
  if (!user_id) return res.status(400).send({ message : 'No user id provided with request.' });

  User.findById(req.user, function (err, me) {
    User.findById(user_id, function (err, user) {
      var follower = me.followers.indexOf(user._id) > -1;

      if (follower) {
        me.followers = me.followers.filter(function (id) { return !id.equals(user._id); });
        me.friends.push(user._id);
        me.save(function (err) {
          user.friends.push(me._id);
          user.save(function (err) {
            res.status(200).send({ message : 'Вы добавили друга.' });
          })
        });
      } else {
        var followed = user.followers.indexOf(me._id) > -1;
        var friended = user.friends.indexOf(me._id) > -1;
        if (followed) return res.status(200).send({ message : 'Вы уже отправляли заявку.' });
        if (friended) return res.status(200).send({ message : 'Вы уже являетесь друзьями.' });
        user.followers.push(me._id);
        user.save(function (err) {
          res.status(200).send({ message : 'Вы отправили Заявку.' });
        });
      }
    });
  });
});

module.exports = router;
