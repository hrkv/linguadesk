module.exports = function(Boards) {
  var router = require('express').Router();
  
  router.get('/', function(req, res, next) {
    Boards.getBoards(req.user.getName(), function(err, boards){
        if (err) {
            return res.render('boards', {
                user: req.user.getName(),
                error: "Something wrong. Please, reload page",
                boards: []
            });
        } else {
            return res.render('boards', {
                user: req.user.getName(),
                boards: boards
            });
        }
    });
  });
  
  router.get('/*', function (req, res, next) {
    Boards.getBoard(req.user.getName(), decodeURIComponent(req.url).substr(1), function(err, board){
        if (err) {
            return res.render('boards', {
                user: req.user.getName(),
                error: "Something wrong. Please, reload page",
                boards: []
            });
        } else if (board) {
            req.session.currentBoard = board.getName();
            board.getWords(function(err, words) {
                return res.render('board', {
                    user: req.user.getName(),
                    boardname: board.getName(),
                    words: words
                });
            });
        } else {
            return res.redirect('/boards');
        }
    });
  });
  
  return router;
}
