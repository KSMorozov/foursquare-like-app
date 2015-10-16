var jwtutils = require('../../utils/jwtutils');
var User     = require('../../models/user');
var express  = require('express');
var router   = express.Router();

router.post('/signup', function (req, res, next) {
  User.findOne({ email : req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message : 'Email is already taken' });
    }
    var user = new User({
      displayName : req.body.displayName,
      email       : req.body.email,
      password    : req.body.password
    });
    user.save(function () {
      res.send({ token : jwtutils.sign(user)});
    });
  });
});

module.exports = router;
