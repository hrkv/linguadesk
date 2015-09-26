module.exports = function(user) {
  var router = require('express').Router();

  router.get('/', function(req, res, next) {
    res.render('login', { title: 'Linguadesk' });
  });

  router.post('/signup', function(req, res, next) {
  });
  
  return router;
}
