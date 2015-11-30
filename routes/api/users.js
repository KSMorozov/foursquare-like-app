var express = require('express');
var User    = require('../../models/user');
var limit   = require('../middleware/limit');
var router  = express.Router();

router.get('/users/:id', limit, function (req, res) {
  var user_id = req.params.id;
  if (!user_id) return res.status(400).send({ message : 'No user id provided with request.' });
  User.findById(user_id, function (err, user) {
    if (!user) return res.status(404).send({ message : 'No User Found.' });
    return res.send(user);
  });
});

// list followers
router.get('/users/:id/followers', limit, function (req, res) {
  var user_id = req.params.id;
  if (!user_id) return res.status(400).send({ message : 'No user id provided with request.' });
  User.findById(user_id, function (err, user) {
    if (!user) return res.status(404).send({ message : 'No user found.'});
    res.send(user.followers);
  });
});

// list friends
router.get('/users/:id/friends', limit, function (req, res) {
  var user_id = req.params.id;
  if (!user_id) return res.status(400).send({ message : 'No user id provided with request.' });
  User.findById(user_id, function (err, user) {
    if (!user) return res.status(404).send({ message : 'No user found.'});
    res.send(user.friends);
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
