var mongoose = require('mongoose');

var schema   = new mongoose.Schema({
  from    : {
    type     : mongoose.Schema.Types.ObjectId, ref: 'User',
    required : true
  },
  to      : {
    type     : mongoose.Schema.Types.ObjectId, ref: 'User',
    required : true
  },
  subject : {
    type     : String,
    required : true
  },
  body    : {
    type     : String,
    required : true
  },
  date    : {
    type     : Date,
    default  : Date.now
  }
});

module.exports = mongoose.model('Message', schema);
