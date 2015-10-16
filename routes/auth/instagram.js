var jwtutils   = require('../../utils/jwtutils');
var User       = require('../../models/user');
var config     = require('../../config');
var express    = require('express');
var request    = require('request');
var router     = express.Router();

router.post('/instagram', function (req, res) {
  var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.INSTAGRAM_SECRET,
    code: req.body.code,
    grant_type: 'authorization_code'
  };

  request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {

    if (req.headers.authorization) {
      User.findOne({ instagram: body.user.id }, function(err, existingUser) {
        if (existingUser) {
          return res.status(409).send({ message: 'There is already an Instagram account that belongs to you' });
        }

        var token = req.headers.authorization.split(' ')[1];
        var payload = jwtutils.decode(token);

        User.findById(payload.sub, function(err, user) {
          if (!user) {
            return res.status(400).send({ message: 'User not found' });
          }
          user.instagram = body.user.id;
          user.picture = user.picture || body.user.profile_picture;
          user.displayName = user.displayName || body.user.username;
          user.save(function() {
            var token = jwtutils.sign(user);
            res.send({ token: token });
          });
        });
      });
    } else {
      User.findOne({ instagram: body.user.id }, function(err, existingUser) {
        if (existingUser) {
          var token = jwtutils.sign(existingUser);
          return res.send({ token: token });
        }

        var user = new User({
          instagram: body.user.id,
          picture: body.user.profile_picture,
          displayName: body.user.username
        });

        user.save(function() {
          var token = jwtutils.sign(user);
          res.send({ token: token, user: user });
        });
      });
    }
  });
});

module.exports = router;
