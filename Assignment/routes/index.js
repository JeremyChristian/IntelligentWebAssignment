var express = require('express');
var router = express.Router();
var Twit = require('twit')

var T = new Twit({
  consumer_key:         'F9DI7pivMCiWCgIDWEDAA6Ovz',
  consumer_secret:      'X7XVnOQ67sU5H6u82mCAAMrna5M9lwYoGY3nCiyJa4QCc8wsiY',
  access_token:         '1683918710-uzeQWurDSWM8aRBFkDkZZofHPHqZiKblHyKcpJB',
  access_token_secret:  'k1q2rsWfMzYqZ6E5OZ6Ncef3wrzxIq2H9uIgwth8hMrDY',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'stusql.dcs.shef.ac.uk',
  user     : 'team060',
  password : '0bd789d4',
  database : 'team060'
});


router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sql', function(req, res, next) {

	connection.connect();

	connection.query('SELECT * FROM Tweets', function(err, rows, fields) {
	  if (!err)
	    console.log('The solution is: ', rows);
	  else
	    console.log('Error while performing Query. '+err);
	});

	connection.end();

  	res.render('index', { title: 'Express' });
});

router.post('/handle',function(req, res, next){
	T.get('search/tweets', { q: req.body.search, count: 100 }, function(err, data, response) {
	  	
	  	var tweet = data.statuses[1];

	  	var handle = tweet.user.screen_name;
	  	var tweet_id = tweet.id;
	  	var date = tweet.created_at;
	  	var text = tweet.text;

	  	res.send(data.statuses);

	 //  	connection.connect();

	 //  	// '+handle+','+text+','+tweet_id+','+date+'

	 //  	var query = 'INSERT INTO Tweets (Author,Text,Tweet_ID,Date) VALUES ("'+handle+'","'+text+'",'+tweet_id+',"'+date+'");'

		// connection.query(query, function(err, rows, fields) {
		//   if (!err)
		//     console.log('The solution is: ', rows);
		//   else
		//     console.log('Error while performing Query. '+err);
		// });

		// connection.end();

	})
});

module.exports = router;