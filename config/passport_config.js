module.exports = function(passport, Users) {
    var LocalStrategy  = require('passport-local').Strategy;
    
    passport.use('signin', new LocalStrategy(function(username, password, done) {
        Users.checkUser(username, password, function(err, user) {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false, { message: 'Incorrect user or password.' });
            } else {
                return done(null, user);    
            }
        });
    }));
    
    passport.serializeUser(function(user, done) {
        done(null, user.getName());
    });
    
    passport.deserializeUser(function(username, done) {
        Users.getUser(username, function(err, user) {
            done(err, user);    
        });
    });
    
};