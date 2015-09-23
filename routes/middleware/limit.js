var jwt     = require('jsonwebtoken');
var config  = require('../../config');
var moment  = require('moment');
var secret  = config.TOKEN_SECRET;

module.exports = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message : 'Please make sure your request has an Authorization header' });
  }
  var token   = req.headers.authorization.split(' ')[1];
  var payload = null;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    return res.status(401).send({ message : err.message });
  }
  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message : 'Token has expired' });
  }
  req.user = payload.sub;
  next();
};
