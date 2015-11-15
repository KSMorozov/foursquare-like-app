var mongoose = require('mongoose');

var schema   = new mongoose.Schema({
  name : {
    type   : String,
    unique : true,
    required : true
  },
  tags : [String]
});

module.exports = mongoose.model('Categories', schema);
