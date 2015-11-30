var User     = require('../../models/user');
var limit    = require('../middleware/limit');
var Meeting  = require('../../models/meeting');
var express  = require('express');
var router   = express.Router();
var async    = require('async');

// create meeting with provided data.
router.post('/meetings', limit, function (req, res) {
  var data = req.body;
  var meeting = new Meeting(data);
  meeting.owner_id = req.user;
  meeting.attendees.push(req.user);
  meeting.save(function (err) {
    if (err) return res.status(500).send({ message : 'Вы не смогли создать встречу.' });
    res.status(200).send({ message : 'Вы успешно создали встречу.', meeting_id : meeting._id });
  });
});

// find and send meetings according to search filters.
router.get('/meetings', limit, function (req, res) {
  var date  = req.query.date_filter,
      tags  = req.query.tags_filter,
      loc   = req.query.location_filter,
      query = {
        date : { $gt : new Date() }
      };
  if (date) query.date   = new Date(date);
  if (tags) query.tags   = { $in : tags };
  if (loc)  query.place  = { $geoWithin : { $center : [ loc.map(function (e) { return parseFloat(e); }), .15 ] } };

  Meeting.find(query, function (err, meetings) {
    if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
    async.map(meetings, function (meeting, callback) {
      User.findById(meeting.owner_id, function (err, owner) {
        if (err) callback(err);
        else {
          meeting.set('owner_picture' , owner.picture, {strict: false});
          meeting.set('owner_name', owner.displayName, {strict: false});
          meeting.set('owner_friends_amount' , owner.friends.length, {strict: false});
          callback(null, meeting);
        }
      });
    }, function (err, meetings_results) {
      if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
      res.status(200).send(meetings_results);
    });
  });
});

// find and send single meeting by its id.
router.get('/meetings/single', limit, function (req, res) {
  var id = req.query.id;
  if (!id) return res.status(500).send({ message : 'Provide id for meeting to find.' });
  Meeting.findById({ _id : id}, function (err, meeting) {
    if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
    User.findById(meeting.owner_id, function (err, owner) {
      if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
      meeting.set('owner_picture' , owner.picture, {strict: false});
      meeting.set('owner_name', owner.displayName, {strict: false});
      meeting.set('owner_friends_amount' , owner.friends.length, {strict: false});
      res.status(200).send(meeting);
    });
  });
});

// find and send meetings for requested user.
router.get('/meetings/owner', limit, function (req, res) {
  var id = req.query.owner;
  if (!id) return res.status(500).send({ message : 'Не предоставлена информация о пользователе.' });
  Meeting.find({ owner_id : id}, function (err, meetings) {
    if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
    res.status(200).send(meetings);
  });
});

// attend meeting - add user id to the list of attendees.
router.post('/meetings/attend', limit, function (req, res) {
  var meeting_id = req.body.id;
  Meeting.findById(meeting_id, function (err, meeting) {
    if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
    if (!meeting) return res.status(404).send({ message : 'Отсутствует встреча по заданным критериям.' });
    if (meeting.attendees.indexOf(req.user) > -1) return res.status(304).send({ message : 'Вы уже откликнулись на эту встречу ранее.' });
    meeting.attendees.push(req.user);
    meeting.save(function (err, meeting) {
      if (err) return res.status(500).send({ message : 'Произошла ошибка :(.' });
      res.status(200).send({ message : 'Вы успешно откликнулись на встречу.' });
    });
  })
});

module.exports = router;
