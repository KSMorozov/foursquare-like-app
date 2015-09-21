var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = mongoose.Schema({
  email     : {
    type      : String,
    unique    : true,
    lowercase : true
  },
  password : {
    type   : String,
    select : false
  },
  name      : String,
  picture   : String,
  facebook  : String,
  google    : String,
  instagram : String,
  twitter   : String
});

schema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, function (err, hash) {
    user.password = hash;
    next();
  });
});

schema.methods.comparePasswords = function (password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function (err, isValid) {
    callback(err, isValid);
  });
};

module.exports = mongoose.model('User', schema);
