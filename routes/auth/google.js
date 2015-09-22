var express = require('express');
var jwt     = require('jsonwebtoken');
var config  = require('../../config');
var User    = require('../../models/user');
var request = require('request');
var router  = express.Router();
var secret  = config.TOKEN_SECRET;

router.post('/', function (req, res) {
  var accessToken = 'https://accounts.google.com/o/oauth2/token';
  var peopleApi   = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params      = {
    code          : req.body.code,
    client_id     : req.body.clientId,
    client_secret : config.GOOGLE_SECRET,
    redirect_uri  : req.body.redirectUri,
    grant_type    : 'authorization_code'
  };

  // request.post();
});

module.exports = router;
