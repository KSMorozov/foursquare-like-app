var express = require('express');
var jwt     = require('jsonwebtoken');
var config  = require('../../config');
var User    = require('../../models/user');
var router  = express.Router();
var secret  = config.TOKEN_SECRET;

router.post('/login', function (req, res, next) {
  User.findOne({ email : req.body.email }, '+password', function (err, user) {
    if (!user) {
      return res.status(401).send({ message : 'Wrong email and/or password' });
    }
    user.comparePasswords(req.body.password, function (err, isValid) {
      if (!isValid) {
        return res.status(401).send({ message : 'Wrong email and/or password' });
      }
      var token = jwt.sign({ name : user.name, sub : user._id },
                           secret, { expiresInMinutes : 1440 });
      res.send({ token : token });
    });
  });
});

module.exports = router;
