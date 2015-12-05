var mongoose = require('mongoose');

var schema   = new mongoose.Schema({
  date        : Date,
  tags        : [String],
  title       : String,
  place       : [Number],
  address     : String,
  categories  : [String],
  event_name  : String,
  description : String,
  attendees   : [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
  owner_id : {
    type      : mongoose.Schema.Types.ObjectId, ref: 'User',
    required  : true
  },
  private : {
    type      : Boolean,
    default   : false
  }
});

module.exports = mongoose.model('Meeting', schema);
