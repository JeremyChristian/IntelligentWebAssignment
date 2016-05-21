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


router.get('/wiki', function(req, res, next) {
  res.render('wiki', { title: 'Express' });
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

  	res.render('wiki', { title: 'Express' });
});

router.post('/wikiquery',function(req, res, next){

	console.log(req.body.search1,req.body.search2);

	team1 = req.body.search1;
	var query = 'PREFIX owl: <http://www.w3.org/2002/07/owl#>\
		PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
		PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
		PREFIX dc: <http://purl.org/dc/elements/1.1/>\
		PREFIX : <http://dbpedia.org/resource/>\
		PREFIX dbpedia2: <http://dbpedia.org/property/>\
		PREFIX dbpedia: <http://dbpedia.org/>\
		PREFIX skos: <http://www.w3.org/2004/02/skos/core#>PREFIX ont: <http://dbpedia.org/ontology>\
		PREFIX ont: <http://dbpedia.org/ontology>\
		SELECT ?player ?name ?position_name ?dob ?pic ?manager ?abstract ?ground ?ground_pic ?ground_abstract\
		WHERE {\
		{<http://dbpedia.org/resource/'+team1+'> <http://dbpedia.org/ontology/ground> ?ground }\
		 { ?ground <http://dbpedia.org/ontology/abstract> ?ground_abstract }\
		 { ?ground <http://dbpedia.org/ontology/thumbnail> ?ground_pic }\
		 {<http://dbpedia.org/resource/'+team1+'> <http://dbpedia.org/ontology/abstract> ?abstract }\
		 {<http://dbpedia.org/resource/'+team1+'> dbpedia2:manager ?manager }\
		 { ?player dbpedia2:currentclub <http://dbpedia.org/resource/'+team1+'> }\
		  { ?player rdfs:label ?name }\
		 { ?player dbpedia2:position ?position }\
		  { ?position rdfs:label ?position_name }\
		{ ?player dbpedia2:birthDate ?dob }\
		{ ?player <http://dbpedia.org/ontology/thumbnail> ?pic}\
		FILTER (langMatches(lang(?name), "EN") && langMatches(lang(?abstract), "EN") && langMatches(lang(?ground_abstract), "EN") && langMatches(lang(?position_name), "EN"))\
	}';
	var client = new SparqlClient(endpoint);
	// console.log("Query to " + endpoint);
	// console.log("Query: " + query);

	client.query(query)
	  //.bind('city', 'db:Chicago') 
	  //.bind('city', 'db:Tokyo') 
	  //.bind('city', 'db:Casablanca') 
	  .bind('city', '<http://dbpedia.org/resource/Vienna>')
	  .execute(function(error, results) {
	  // process.stdout.write(util.inspect(arguments, null, 20, true)+"\n");1
	  // console.log(results);
	  result1 = results.results.bindings;
	  
	});

	team2 = req.body.search2;
	var query = 'PREFIX owl: <http://www.w3.org/2002/07/owl#>\
		PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
		PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
		PREFIX dc: <http://purl.org/dc/elements/1.1/>\
		PREFIX : <http://dbpedia.org/resource/>\
		PREFIX dbpedia2: <http://dbpedia.org/property/>\
		PREFIX dbpedia: <http://dbpedia.org/>\
		PREFIX skos: <http://www.w3.org/2004/02/skos/core#>PREFIX ont: <http://dbpedia.org/ontology>\
		PREFIX ont: <http://dbpedia.org/ontology>\
		SELECT ?player ?name ?position_name ?dob ?pic ?manager ?abstract ?ground ?ground_pic ?ground_abstract\
		WHERE {\
		{<http://dbpedia.org/resource/'+team2+'> <http://dbpedia.org/ontology/ground> ?ground }\
		 { ?ground <http://dbpedia.org/ontology/abstract> ?ground_abstract }\
		 { ?ground <http://dbpedia.org/ontology/thumbnail> ?ground_pic }\
		 {<http://dbpedia.org/resource/'+team2+'> <http://dbpedia.org/ontology/abstract> ?abstract }\
		 {<http://dbpedia.org/resource/'+team2+'> dbpedia2:manager ?manager }\
		 { ?player dbpedia2:currentclub <http://dbpedia.org/resource/'+team2+'> }\
		  { ?player rdfs:label ?name }\
		 { ?player dbpedia2:position ?position }\
		  { ?position rdfs:label ?position_name }\
		{ ?player dbpedia2:birthDate ?dob }\
		{ ?player <http://dbpedia.org/ontology/thumbnail> ?pic}\
		FILTER (langMatches(lang(?name), "EN") && langMatches(lang(?abstract), "EN") && langMatches(lang(?ground_abstract), "EN") && langMatches(lang(?position_name), "EN"))\
	}';
	var client = new SparqlClient(endpoint);
	// console.log("Query to " + endpoint);
	// console.log("Query: " + query);

	client.query(query)
	  //.bind('city', 'db:Chicago') 
	  //.bind('city', 'db:Tokyo') 
	  //.bind('city', 'db:Casablanca') 
	  .bind('city', '<http://dbpedia.org/resource/Vienna>')
	  .execute(function(error, results) {
	  // process.stdout.write(util.inspect(arguments, null, 20, true)+"\n");1
	  // console.log(results);
	  result2 = results.results.bindings;
	  
	});

	console.log([result1,result2]);
  	// console.log(array);

  	res.send([result1,result2]);

});

module.exports = router;