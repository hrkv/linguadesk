var express = require('express');
var Boards = require('../models/Boards');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('createBoard', {
    title: '',
    user: req.user.getName()
  });
});

router.post('/', function(req, res, next) {
  var boardName = req.body.board,
      direction = req.body.language.split("-"),
      translateLang = direction[0],
      originalLang = direction[1];
  
  Boards.addBoard(req.user.getName(), boardName, originalLang, translateLang, function(err, result) {
      if (err) {
        console.log("! addBoard: " + err);
      } else {
        res.redirect("/boards");
      }
  });
});

module.exports = router;
