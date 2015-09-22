var express = require('express');
var jwt     = require('jsonwebtoken');
var config  = require('../../config');
var User    = require('../../models/user');
var router  = express.Router();
var secret  = config.TOKEN_SECRET;

router.post('/', function () {
  User.findOne({ email : req.body.email }, function (err, existingUser) {
    if (user) {
      return res.status(409).send({ message : 'Email is already taken' });
    }
    var user = new User({
      name     : req.body.name,
      email    : req.body.email,
      password : req.body.password
    });
    var token = jwt.sign({ username : user.username, _id : user._id },
                         secret, { expiresInMinutes : 1440 });
    user.save(function () {
      res.send({ token :  token});
    });
  });
});

module.exports = router;
