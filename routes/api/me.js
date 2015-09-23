var express = require('express');
var User    = require('../../models/user');
var limit   = require('../middleware/limit');
var router  = express.Router();

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
    user.name  = req.body.name  || user.name;
    user.email = req.body.email || user.email;
    user.save(function (err) {
      res.status(200).end();
    });
  });
});

module.exports = router;
