var User     = require('../../models/user');
var Meeting  = require('../../models/meeting');
var Invite   = require('../../models/invite');
var limit    = require('../middleware/limit');
var express  = require('express');
var router   = express.Router();
var async    = require('async');

// create meeting with provided data.
router.post('/invites', limit, function (req, res) {
  var friend_ids = req.body.friends;
  var meeting_id = req.body.meeting;
  console.log(friend_ids, meeting_id);
  async.each(
    friend_ids,
    function (friend_id, callback) {
      var invite = new Invite({
        from : req.user,
        to   : friend_id,
        body : 'Предлагает посетить встречу',
        event_id : meeting_id
      });
      invite.save(function (err, invite) {
        if (err) callback(err);
        else callback();
      });
    },
    function (err) {
      if (err) return res.status(500).send({ message : 'Вы уже отправяли приглашение ранее :(' });
      var msg = friend_ids.length > 1 ? 'приглашения.' : 'приглашениe.';
      res.status(200).send({ message : 'Вы Успешно отправили ' + msg });
    }
  );
});


// find and send comments for a meeting by its id.
router.get('/invites', limit, function (req, res) {
  var addresser = req.query.addresser;
  var recipient = req.user;
  Invite.find({to : recipient, from : addresser}, function (err, invites) {
    if (err) return res.status(500).send({ message : 'Не получилось найти приглашения.' });
    if (!invites.length) return res.status(404).send({ message : 'Нету приглашений от данного пользователя.' });
    async.map(
      invites,
      function (invite, callback) {
        Meeting.findById(invite.event_id, function (err, meeting) {
          if (err) callback(err);
          else {
            var meeting_title = meeting.title;
            User.findById(invite.from, function (err, addresser) {
              if (err) callback(err);
              invite.set('addresser_picture' , addresser.picture, {strict: false});
              invite.set('addresser_name', addresser.displayName, {strict: false});
              invite.set('meeting_title' , meeting_title, {strict: false});
              callback(null, invite);
            });
          }
        });
      },
      function (err, invites_results) {
        if (err) return res.status(500).send({ message : 'Не получилось найти приглашения.' });
        res.status(200).send({ invites : invites_results, message : 'У вас есть неотвеченные приглашения. ' });
      }
    );
  });
});

router.post('/invites/respond', limit, function (req, res) {
  var invite_id  = req.body.invite_id;
  var meeting_id = req.body.meeting_id;
  var action     = req.body.action;
  if (action) {
    Meeting.findById(meeting_id, function (err, meeting) {
      if (err) return res.status(500).send({ message : 'Произошла ошибка :(' });
      if (!meeting) return res.status(404).send({ message : 'Не получилось найти данную встречу.' });
      if (meeting.attendees.indexOf(req.user) > - 1) return res.status(500).send({ message : 'Вы уже являетесь участником данной встречи.' });
      meeting.attendees.push(req.user);
      meeting.save(function (err, meeting) {
        Invite.remove({ _id : invite_id}, function (err) {
          if (err) return res.status(500).send({ message : 'Произошла ошибка :(' });
          res.status(200).send({ message : 'Вы успешно приняли приглашение.' });
        });
      });
    });
  } else {
    Invite.remove({ _id : invite_id}, function (err) {
      if (err) return res.status(500).send({ message : 'Произошла ошибка :(' });
      res.status(200).send({ message : 'Вы успешно отклонили приглашение.' });
    });
  }
});

module.exports = router;
