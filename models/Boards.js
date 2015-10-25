var db = require('../models/database');
var Users = require('../models/Users');
var Words = require('../models/Words')(db);

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
    Words.getAll(this.id, next);
};

Board.prototype.addWord = function(word, next) {
    Words.add(word, this.id, next);
};

Board.prototype.addTranslate = function (word, translate, next) {
    Words.addTranslate(word, translate, this.id, next);    
};

Board.prototype.updateTranslate = function (word, oldTranslate, newTranslate, next) {
    Words.updateTranslate(word, oldTranslate, newTranslate, this.id, next);    
};

Board.prototype.deleteTranslate = function (word, translate, next) {
    Words.deleteTranslate(word, translate, this.id, next);    
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