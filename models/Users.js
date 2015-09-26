var db = require('../models/database');

function User(settings) {
    this.name = settings.login;
}

User.prototype.getName = function() {
    return this.name;    
};

//only for authorized users
var cachedUsers = {};

module.exports = {
    checkCachedUsers: function (login) {
        return cachedUsers[login];
    },
    checkUser: function(login, password, next) {
        var cachedUser = this.checkCachedUsers(login);
        if (cachedUser) {
            next(null, cachedUser);
        } else {
            db.get({
                sql: "select * from users where login=($1) and pass=($2)",
                parameters: [login, password],
                uniq: true,
                type: User
            },
            function(err, result) {
                console.log("innext");
                if (err) {
                    next(err);
                } else if (result) {
                    cachedUsers[result.getName()] = result;
                    next(null, result);
                } else {
                    next(null, null);
                }
            });
        }
    },
    getUser: function(login, next) {
        var cachedUser = this.checkCachedUsers(login);
        if (cachedUser) {
            next(null, cachedUser);
        } else {
            db.get({
                sql: "select * from users where login=($1)",
                parameters: [login],
                uniq: true,
                type: User
            }, next);
        }
    }
}