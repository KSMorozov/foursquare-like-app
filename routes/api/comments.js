var User     = require('../../models/user');
var Comment  = require('../../models/comment');
var limit    = require('../middleware/limit');
var express  = require('express');
var router   = express.Router();
var async    = require('async');

// create meeting with provided data.
router.post('/comments', limit, function (req, res) {
  var data = req.body;
  data.from = req.user;
  var comment = new Comment(data);
  comment.save(function (err, comment) {
    if (err) return res.status(500).send({ message : 'Не удалось оставить комментарий.' });
    res.status(200).send({ message : 'Успешно оставили комментарий.' });
  });
});


// find and send comments for a meeting by its id.
router.get('/comments', limit, function (req, res) {
  var id = req.query.id;
  Comment.find({ to : id }, function (err, comments) {
    async.map(comments,
    function (comment, callback) {
      User.findById(comment.from, function (err, owner) {
        if (err) callback(err);
        else {
          comment.set('owner_picture' , owner.picture, {strict: false});
          comment.set('owner_name', owner.displayName, {strict: false});
          callback(null, comment);
        }
      });
    }, function (err, comments_results) {
      if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
      res.status(200).send(comments);
    });
  });
});

module.exports = router;
