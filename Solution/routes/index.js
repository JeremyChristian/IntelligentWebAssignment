var express = require('express');
var router = express.Router();
var Twit = require('twit');
var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://dbpedia.org/sparql';

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
	
	console.log(req.body);

	query = '';

	// All words portion of the query
	if (req.body.allWords != '') {
		req.body.allWords.split(/ +/).forEach(function(item,index,array){
			if (item != '') {
		  		query += item + ' ';
		  	};
		});
		query = query.substring(0, query.length-1);
	}

	// Exact phrase portion of the query
	if (req.body.allWords != '') {
		query += ' "' + req.body.exactPhrase + '" '
	}
	// Any words portion of the query
	if (req.body.allWords != '') {
		req.body.anyWords.split(/ +/).forEach(function(item,index,array){
			if (item != '') {
		  		query += item +' OR ';
		  	};
		});
		query = query.substring(0, query.length-3);
	}

	// Not these words portion of the query
	if (req.body.allWords != '') {
		req.body.notWords.split(/ +/).forEach(function(item,index,array){
			if (item != '') {
		  		query += '-' + item + ' ';
		  	};
		});
	}

	// Containing these hashtags
	if (req.body.allWords != '') {
		req.body.hashtags.split(/ +/).forEach(function(item,index,array){
			if (item != '') {
		    	if (item.charAt(0) == '#') 
		        	query += item + ' ';
		    	
		    	else 
		    		query += '#' + item + ' ';
		  	};
		});
	}
	
	// From these accounts
	if (req.body.allWords != '') {
		req.body.fromAccounts.split(/ +/).forEach(function(item,index,array){
			if (item != '') {
		    	query += 'from:' + item + ' ';
		  	};
		});
	}

	// To these accounts
	if (req.body.allWords != '') {
		req.body.toAccount.split(/ +/).forEach(function(item,index,array){
			if (item != '') {
		    	query += 'to:' + item + ' ';
		  	};
		});
	}

	// Mentioning these accounts
	if (req.body.allWords != '') {
		req.body.mentionAccounts.split(/ +/).forEach(function(item,index,array){
			if (item != '') {
		    	if (item.charAt(0) == '@') 
		        	query += item + ' ';
		    	
		    	else 
		    		query += '@' + item + ' ';	
		  	};
		});
	}
	console.log(query);

	T.get('search/tweets', { q: query, count: 100 }, function(err, data, response) {
	  	
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
		
	  	res.send([data.statuses,array]);
	  	// console.log(data.statuses);
	});
	
});

module.exports = router;