var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/string', function(req, res, next) {

	var text = '{"name":"John Johnson","street":"Oslo West 16","phone":"555 1234567"}';
    var obj = JSON.parse(text);
	
  	res.send({ some: 'json' });

});

module.exports = router;
