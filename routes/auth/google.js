var User    = require('../../models/user');
var config  = require('../../config');
var jwt     = require('jsonwebtoken');
var express = require('express');
var request = require('request');
var moment  = require('moment');
var router  = express.Router();
var secret  = config.TOKEN_SECRET;

router.post('/google', function (req, res, next) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl   = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params         = {
    code          : req.body.code,
    client_id     : req.body.clientId,
    client_secret : config.GOOGLE_SECRET,
    redirect_uri  : req.body.redirectUri,
    grant_type    : 'authorization_code'
  };

  request.post(accessTokenUrl, { json : true, form : params }, function (err, resp, token) {
    var accessToken = token.access_token;
    var headers     = { Authorization : 'Bearer ' + accessToken };

    request.get({ url : peopleApiUrl, headers : headers, json : true }, function (err, resp, profile) {
      if (profile.error) {
        return res.status(500).send({ message : profile.error.message });
      }
      if (req.headers.authorization) {
        User.findOne({ google : profile.sub }, function (err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message : 'There is already a Google account that belongs to you' });
          }
          var token   = req.headers.authorization.split(' ')[1];
          var payload = jwt.verify(token, secret);
          User.findById(payload.sub, function (err, user) {
            if (!user) {
              return res.status(400).send({ message : 'User not found' });
            }
            user.google  = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.name    = user.name    || profile.name;
            user.save(function () {
              var token  = jwt.sign({ name : user.name, sub : user._id,
                                      iat: moment().unix(),
                                      exp: moment().add(14, 'days').unix() }, secret);
              res.send({ token : token });
            });
          });
        });
      } else {
        User.findOne({ google : profile.sub }, function (err, existingUser) {
          if (existingUser) {
            var token  = jwt.sign({ name : existingUser.name, sub : existingUser._id,
                                    iat: moment().unix(),
                                    exp: moment().add(14, 'days').unix() }, secret);
            return res.send({ token : token });
          }
          var user     = new User();
          user.google  = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.name    = profile.name;
          user.save(function () {
            var token  = jwt.sign({ name : user.name, sub : user._id,
                                    iat: moment().unix(),
                                    exp: moment().add(14, 'days').unix() }, secret);
            res.send({ token : token });
          });
        });
      }
    });
  });
});

module.exports = router;
