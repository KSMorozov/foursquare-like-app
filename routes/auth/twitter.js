var express = require('express');
var qs      = require('querystring');
var jwt     = require('jsonwebtoken');
var config  = require('../../config');
var User    = require('../../models/user');
var request = require('request');
var router  = express.Router();
var secret  = config.TOKEN_SECRET;

router.post('/twitter', function (req, res, next) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl  = 'https://api.twitter.com/oauth/access_token';
  var profileUrl      = 'https://api.twitter.com/1.1/users/show.json?screen_name=';
  if (!req.body.oauth_token || !req.body.oauth_veriier) {
    var requestTokenOauth = {
      consumer_key    : config.TWITTER_KEY,
      consumer_secret : config.TWITTER_SECRET,
      callback        : req.body.redirectUri
    };

    request.post({ url : requestTokenUrl, oauth : requestTokenOauth }, function (error, response, body) {
      var oauthToken = qs.parse(body);
      res.send(oauthToken);
    });
  } else {
    var accessTokenOauth = {
      consumer_key    : config.TWITTER_KEY,
      consumer_secret : config.TWITTER_SECRET,
      token           : req.body.oauth_token,
      verifier        : req.body.oauth_veriier
    };

    request.post({ url : accessTokenUrl, oauth : accessTokenOauth }, function (error, response, accessToken) {
      accessToken = qs.parse(accessToken);
      var profileOauth = {
        consumer_key    : config.TWITTER_KEY,
        consumer_secret : config.TWITTER_SECRET,
        oauth_token     : accessToken.oauth_token
      };

      request.get({
        url   : profileUrl + accessToken.screen_name,
        oauth : profileOauth,
        json  : true
      }, function (error, response, profile) {
        if (req.headers.authorization) {
          User.findOne({ twitter : profile.id }, function (err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message : 'There is already a Twitter account that belongs to you' });
            }
            var token   = req.headers.authorization.split(' ')[1];
            var payload = jwt.verify(token, secret);
            User.findById(payload.sub, function (err, user) {
              if (!user) {
                return res.status(400).send({ message : 'User not found' });
              }
              user.twitter = profile.id;
              user.name    = user.name    || profile.name;
              user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
              user.save(function (err) {
                var token  = jwt.sign({ name : user.name, sub : user._id },
                                     secret, { expiresInMinutes : 1440 });
                res.send({ token : token });
              });
            });
          });
        } else {
          User.findOne({ twitter : profile.id }, function (err, existingUser) {
            if (existingUser) {
              var token = jwt.sign({ name : existingUser.name, sub : existingUser._id },
                                   secret, { expiresInMinutes : 1440 });
              return res.send({ token : token });
            }
            var user = new User();
            user.twitter = profile.id;
            user.name    = profile.name;
            user.picture = profile.profile_image_url.replace('_normal', '');
            user.save(function () {
              var token  = jwt.sign({ name : user.name, sub : user._id },
                                   secret, { expiresInMinutes : 1440 });
              res.send({ token : token });
            });
          });
        }
      });
    });
  }
});

module.exports = router;
