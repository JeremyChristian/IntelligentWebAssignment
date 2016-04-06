var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/handle',function(request,response){
	console.log(request.body);

});

module.exports = router;