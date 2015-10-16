var jwt     = require('jsonwebtoken');
var config  = require('../config');
var secret  = config.TOKEN_SECRET;
var moment  = require('moment');

module.exports = {
  sign : function (user) {
    var payload = {
      name : user.name,
      sub : user._id,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix()
    }
    return jwt.sign(payload, secret);
  },
  decode : function (token) {
    return jwt.verify(token, secret);
  }
}
