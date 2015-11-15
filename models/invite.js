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
  body    : {
    type     : String,
    required : true
  },
  event_id : {
    type     : mongoose.Schema.Types.ObjectId,
    required : true,
  },
  date    : {
    type     : Date,
    default  : Date.now
  }
});

module.exports = mongoose.model('Invite', schema);
