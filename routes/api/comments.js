var User     = require('../../models/user');
var Comment  = require('../../models/comment');
var limit    = require('../middleware/limit');
var express  = require('express');
var router   = express.Router();
var async    = require('async');

// create meeting with provided data.
router.post('/comments', limit, function (req, res) {
  var comment = new Comment({
    from : req.user,
    to   : req.body.thing,
    body : req.body.body
  });
  comment.save(function (err, comment) {
    if (err) return res.status(500).send({ message : 'Не удалось оставить комментарий.' });
    User.findById(comment.from, function (err, owner) {
      if (err) return res.status(500).send({ message : 'Не удалось оставить комментарий.' });
      comment.set('owner_picture', owner.picture, {strict : false});
      comment.set('owner_name', owner.displayName, {strict : false});
      res.status(200).send({ comment : comment, message : 'Успешно оставили комментарий.' });
    });
  });
});


// find and send comments for a meeting by its id.
router.get('/comments', limit, function (req, res) {
  var thing = req.query.thing;
  Comment.find({ to : thing }, function (err, comments) {
    async.map(comments,
    function (comment, callback) {
      User.findById(comment.from, function (err, owner) {
        if (err) callback(err);
        else {
          comment.set('owner_picture', owner.picture, {strict: false});
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
