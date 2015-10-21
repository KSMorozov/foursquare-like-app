var User       = require('../../models/user');
var limit      = require('../middleware/limit');
var express    = require('express');
var formidable = require('formidable');
var fs         = require('fs');
var path       = require('path');
var router     = express.Router();

router.post('/uploads/avatars', limit, function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(fields.user);
    var old_path  = files.file.path;
    var file_size = files.file.size;
    var file_ext  = files.file.name.split('.').pop();
    var index     = old_path.lastIndexOf('/') + 1;
    var file_name = old_path.substr(index);
    var new_path  = path.join(__dirname, '../../public/images/avatars/', file_name + '.' + file_ext);
    console.log(old_path + '\n', file_size + '\n', file_ext + '\n', index + '\n', file_name + '\n', new_path + '\n');

    fs.readFile(old_path, function (err, data) {
      console.log(req.user);
      fs.writeFile(new_path, data, function (err) {
        fs.unlink(old_path, function (err) {
          if (err) {
            res.status(500);
            res.send({'message' : 'Failed to upload.'});
          } else {
            User.findById(req.user, function (err, user) {
              if (err) return res.status(404).send({ message : 'No User Found' });
              user.picture = new_path.substr(new_path.indexOf('images'));
              user.save(function (err) {
                res.status(200).send({'picture' : '/app/public/' + new_path.substr(new_path.indexOf('images'))});
              });
            });
          }
        });
      });
    })
  });
});

module.exports = router;
