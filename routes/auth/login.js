var jwtutils = require('../../utils/jwtutils');
var User     = require('../../models/user');
var config   = require('../../config');
var express  = require('express');
var router   = express.Router();

router.post('/login', function (req, res, next) {
  User.findOne({ email : req.body.email }, '+password', function (err, user) {
    if (!user) {
      return res.status(401).send({ message : 'Wrong email and/or password' });
    }
    user.comparePassword(req.body.password, function (err, isValid) {
      if (!isValid) {
        return res.status(401).send({ message : 'Wrong email and/or password' });
      }
      res.send({ token : jwtutils.sign(user) });
    });
  });
});

module.exports = router;
