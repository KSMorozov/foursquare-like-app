var mongoose = require('mongoose');

var schema   = new mongoose.Schema({
  from    : {
    type     : mongoose.Schema.Types.ObjectId, ref: 'User',
    required : true
  },
  to      : {
    type     : mongoose.Schema.Types.ObjectId, ref: 'Meeting',
    required : true
  },
  body    : {
    type     : String,
    required : true
  },
  date    : {
    type     : Date,
    default  : Date.now
  },
  upboats : [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Comment', schema);
