var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Belajar Express' });
});

/* DEMO - render template */
router.get('/demo/:id/:category', function(req, res, next) {
  res.render('demo', {
    message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    user: {
      name: 'suyono',
      email: 'suyono@gmail.com',
      website: 'suyono.com'
    },
    id: req.params.id,
    category: req.params.category
  });
});

/* DEMO2 - render template */
router.get('/demo2', function(req, res, next) {
  res.json({
    message: 'Lorem ipsum sit dolor amet',
    user: {name:'suyono', email:'suyono@example.com', website: 'http://www.suyono.com'}
  });
});

module.exports = router;
