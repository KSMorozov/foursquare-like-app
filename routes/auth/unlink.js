var User    = require('../../models/user');
var express = require('express');
var limit   = require('../middleware/limit');
var router  = express.Router();

router.post('/unlink', limit, function (req, res) {
  var provider  = req.body.provider;
  var providers = ['facebook', 'google', 'instagram', 'twitter'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message : 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function (err, user) {
    if (!user) {
      return res.status(400).send({ message : 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function () {
      res.status(200).end();
    });
  });
});

module.exports = router;
