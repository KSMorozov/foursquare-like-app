var mongoose = require('mongoose');

var schema   = new mongoose.Schema({
  owner       : {
    type     : mongoose.Schema.Types.ObjectId, ref: 'User',
    required : true
  },
  description : {
    type     : String,
    required : true
  },
  private     : {
    type     : Boolean,
    default  : false
  },
  location    : {
    type     : [Number]
  },
  date        : {
    type     : Date,
    required : true
  },
  categories : mongoose.Schema.Types.Mixed,
  eventname  : String,
  time       : String
});

module.exports = mongoose.model('Meeting', schema);
