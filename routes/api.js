module.exports = function (Boards) {
    var router = require('express').Router();
    
    router.post('/boards/words/addword', function (req, res, next) {
        Boards.getBoard(req.user.getName(), req.session.currentBoard, function(err, board){
            if (err) {
                return res.json({error: err});
            } else if (board) {
                board.addWord(req.body.newword, function(err, words) {
                    if (err) {
                        res.json({error: err});
                    } else {
                        res.json({result: true});
                    }
                });
            }
        });
    });
  
    router.post('/boards/words/addtranslate', function (req, res, next) {
        Boards.getBoard(req.user.getName(), req.session.currentBoard, function(err, board){
            if (err) {
                return res.json({error: err});
            } else if (board) {
                board.addTranslate(req.body.word, req.body.translate, function(err, words) {
                    if (err) {
                        res.json({error: err});
                    } else {
                        res.json({result: true});
                    }
                });
            }
        });
    });
  
    router.post('/boards/words/getall', function (req, res, next) {
        Boards.getBoard(req.user.getName(), req.session.currentBoard, function(err, board){
            if (err) {
                return res.json({error: err});
            } else if (board) {
                board.getWords(function(err, words) {
                    if (err) {
                        res.json({error: err});
                    } else {
                        res.json({result: true, words: words});
                    }
                });
            }
        });
    });
  
    return router;
};