var User    = require('../../models/user');
var config  = require('../../config');
var jwt     = require('jsonwebtoken');
var express = require('express');
var moment  = require('moment');
var router  = express.Router();
var secret  = config.TOKEN_SECRET;

router.post('/signup', function (req, res, next) {
  User.findOne({ email : req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message : 'Email is already taken' });
    }
    var user = new User({
      name     : req.body.name,
      email    : req.body.email,
      password : req.body.password
    });
    var token  = jwt.sign({ name : user.name, sub : user._id,
                            iat: moment().unix(),
                            exp: moment().add(14, 'days').unix() }, secret);
    user.save(function () {
      res.send({ token :  token});
    });
  });
});

module.exports = router;
