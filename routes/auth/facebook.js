var express = require('express');
var jwt     = require('jsonwebtoken');
var config  = require('../../config');
var User    = require('../../models/user');
var request = require('request');
var router  = express.Router();
var secret  = config.TOKEN_SECRET;

router.post('/facebook', function (req, res, next) {
  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl    = 'https://graph.facebook.com/v2.3/me';
  var params = {
    code          : req.body.code,
    client_id     : req.body.clientId,
    client_secret : config.FACEBOOK_SECRET,
    redirect_uri  : req.body.redirectUri
  };

  request.get({ url : accessTokenUrl, qs : params, json : true }, function (error, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message : accessToken.error.message });
    }

    request.get({ url : graphApiUrl, qs : accessToken, jsson : true }, function (error, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message : profile.error.message });
      }
      if (req.headers.authorization) {
        User.findOne({ facebook : profile.id }, function (err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message : 'There is already a Facebook account that belongs to you' });
          }
          var token   = req.headers.authorization.split(' ')[1];
          var payload = jwt.verify(token, secret);
          User.findById(payload.sub, function (err, user) {
            if (!user) {
              return res.status(400).send({ message : 'User not found' });
            }
            user.facebook = profile.id;
            user.picture  = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.name     = user.name    || profile.name;
            user.save(function () {
              var token  = jwt.sign({ name : user.name, sub : user._id },
                                   secret, { expiresInMinutes : 1440 });
              res.send({ token : token });
            });
          });
        });
      } else {
        User.findOne({ facebook : profile.id }, function (err, existingUser) {
          if (existingUser) {
            var token = jwt.sign({ name : existingUser.name, sub : existingUser._id },
                                 secret, { expiresInMinutes : 1440 });
            return res.send({ token : token });
          }
          var user      = new User();
          user.facebook = profile.id;
          user.picture  = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.name     = profile.name;
          user.save(function () {
            var token  = jwt.sign({ name : user.name, sub : user._id },
                                 secret, { expiresInMinutes : 1440 });
            res.send({ token : token });
          });
        });
      }
    });
  });
});

module.exports = router;
