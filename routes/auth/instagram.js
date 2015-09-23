var User    = require('../../models/user');
var config  = require('../../config');
var jwt     = require('jsonwebtoken');
var express = require('express');
var request = require('request');
var moment  = require('moment');
var router  = express.Router();
var secret  = config.TOKEN_SECRET;

router.post('/instagram', function (req, res, next) {
  var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
  var params = {
    code          : req.body.code,
    client_id     : req.body.clientId,
    client_secret : config.INSTAGRAM_SECRET,
    redirect_uri  : req.body.redirectUri,
    grant_type    : 'authorization_code'
  };

  request.post({ url : accessTokenUrl, form : params, json : true }, function (error, response, body) {
    if (req.headers.authorization) {
      User.findOne({ instagram : body.user.id }, function (err, existingUser) {
        if (existingUser) {
          return res.status(409).send({ message : 'There is already an Instagram account that belongs to you' });
        }
        var token   = req.headers.authorization.split(' ')[1];
        var payload = jwt.verify(token, secret);

        User.findById(payload.sub, function (err, user) {
          if (!user) {
            return res.status(400).send({ message : 'User not found' });
          }
          user.instagram = body.user.id;
          user.picture   = user.picture || body.user.profile_picture;
          user.name      = user.name    || body.user.username;
          user.save(function () {
            var token  = jwt.sign({ name : user.name, sub : user._id,
                                    iat: moment().unix(),
                                    exp: moment().add(14, 'days').unix() }, secret);
            res.send({ token : token });
          });
        });
      });
    } else {
      User.findOne({ instagram : body.user.id }, function (err, existingUser) {
        if (existingUser) {
          var token  = jwt.sign({ name : existingUser.name, sub : existingUser._id,
                                  iat: moment().unix(),
                                  exp: moment().add(14, 'days').unix() }, secret);
          return res.send({ token : token });
        }

        var user = new User({
          instagram : body.user.id,
          picture   : body.user.profile_picture,
          name      : body.user.username
        });

        user.save(function () {
          var token  = jwt.sign({ name : user.name, sub : user._id,
                                  iat: moment().unix(),
                                  exp: moment().add(14, 'days').unix() }, secret);
          res.send({ token : token, user : user });
        });
      });
    }
  });
});

module.exports = router;
