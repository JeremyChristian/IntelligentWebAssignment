var express = require('express');
var router = express.Router();
var Twit = require('twit')
var Stoplist = require('../public/javascripts/stoplist.js')
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
	  	
	  	library = {};
	  	data.statuses.forEach(function(object,index){
			object.text.toLowerCase().split(" ").forEach(function(object,index){
				if (Stoplist.indexOf(object) >= 0){

				}
				else if(library.hasOwnProperty(object)){
					library[object] = library[object] + 1;
				}
				else {
					library[object] = 1;
				}
			});
	  	});
	  	array = []
	  	for(word in library){
		 	array.push([word,library[word]])
		}
		array.sort(function(a,b){return a[1] - b[1]});
		array.reverse();
		for(x in data.statuses){
	  		console.log(data.statuses[x].geo);
	  	}
	  	res.send(data.statuses);
	});
});

module.exports = router;