var db = require('../models/database');
var Users = require('../models/Users');

function Board(settings) {
    this.id = settings.id;
    this.name = settings.name;
    this.owner = settings.owner;
    this.originalLang = settings.original_lang;
    this.translateLang = settings.translate_lang;
    this.wordsCounter = settings.words_counter || 0;
    this.description = settings.description;
}

Board.prototype.getName = function() {
    return this.name;    
};

Board.prototype.getWords = function(next) {
    db.get({
        sql: "select * from words where boardid=($1)",
        parameters: [this.id]
    }, function(err, result){
        if (err) {
            return next(err, []);
        } else {
            return next(null, result || []);
        }
    });
};

Board.prototype.addWord = function(word, next) {
    var boardId = this.id;
    
    db.get({
        sql: "select * from words where boardid=($1) and original=($2)",
        parameters: [this.id, word],
        uniq: true
    }, function(err, result) {
        console.log("word in table: " + JSON.stringify(result));
        if (err) {
            return next(err, null);
        } else if (!result) {
            db.put({
                sql: "insert into words (boardid, original) values($1, $2)",
                parameters: [boardId, word]
            }, function(err, result) {
                if (err) {
                    return next(err, null);
                } else {
                    return next(null, true);
                }
            });
        } else {
            next(null, false);
        }
    });
};

module.exports = {
    addBoard: function(username, boardname, originLanguage, translateLanguage, next) {
        if (Users.checkCachedUsers(username)) {
            db.put({
                sql: "insert into boards(name, owner, original_lang, translate_lang) values($1, $2, $3, $4)",
                parameters: [boardname, username, originLanguage, translateLanguage]
            }, next);
        }
    },
    getBoard: function(username, boardname, next) {
        if (Users.checkCachedUsers(username)) {
            db.get({
                sql: "select * from boards where name=($1) and owner=($2)",
                parameters: [boardname, username],
                uniq: true,
                type: Board
            }, next);
        }
    },
    getBoards: function (username, next) {
        if (Users.checkCachedUsers(username)) {
            db.get({
                sql: "select * from boards where owner=($1)",
                parameters: [username],
                type: Board
            }, next);
        }
    }
}