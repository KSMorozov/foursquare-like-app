var jwtutils   = require('../../utils/jwtutils');
var User       = require('../../models/user');
var config     = require('../../config');
var express    = require('express');
var request    = require('request');
var router     = express.Router();

router.post('/facebook', function (req, res) {
  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  request.get({ url: accessTokenUrl, qs: params, json: true }, function (err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    request.get({ url: graphApiUrl, qs: accessToken, json: true}, function (err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }

      if (req.headers.authorization) {
        User.findOne({ facebook: profile.id }, function (err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }

          var token = req.headers.authorization.split(' ')[1];
          var payload = jwtutils.decode(token);
          User.findById(payload.sub, function (err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture  = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function () {
              var token = jwtutils.sign(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        User.findOne({ facebook: profile.id }, function (err, existingUser) {
          if (existingUser) {
            var token = jwtutils.sign(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture  = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function () {
            var token = jwtutils.sign(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

module.exports = router;
