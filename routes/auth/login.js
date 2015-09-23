var User    = require('../../models/user');
var config  = require('../../config');
var jwt     = require('jsonwebtoken');
var express = require('express');
var moment  = require('moment');
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
      var token  = jwt.sign({ name : user.name, sub : user._id,
                              iat: moment().unix(),
                              exp: moment().add(14, 'days').unix() }, secret);
      res.send({ token : token });
    });
  });
});

module.exports = router;
