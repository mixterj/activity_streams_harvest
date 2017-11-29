
/**
 * Module dependencies.
 */

// get configuration settings
var config = require('./config');

// define requirements
var express = require('express')
  , http = require('http')
  , path = require('path');

// define app
var app = express();

// all environments
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// create ElasticSearch client
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.searchServer+':'+config.searchPort,
  log: 'error'
});
var errorObject = config.errorObject["400"];
var bodyObject = {};
var query = "";
var q = "";

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// callback function for all responses
function sendResponse(res,obj) {
  console.log('got to send')
  res.writeHead(obj.status, { "Content-Type": obj.contentType });
  res.write(obj.json);
  res.end();
}

//handle search engine response
function handleResponse(req, res, error, response) {
	console.log('handler req ' + req);
    if (error){
        errorObject.json = "{ \"error\": "+JSON.stringify(error)+" }";
        sendResponse(res,errorObject);
      } else {
        // object to hold response properties
        var obj = {};
        
        // CHANGE = Made content type jsonld 
        obj.contentType = config.contentTypes.jsonld; 
        obj.status = "200";
        if (req.params.id){
	        var jsonld = {};
	        jsonld['@context'] = ["https://www.w3.org/ns/activitystreams", "http://iiif.io/api/presentation/2/context.json"];
	        jsonld['id'] = 'http://52.204.112.237:3051/activity-streams/' + req.params.id;
	        jsonld['type'] = 'CollectionPage';
	        jsonld.items = [];
	        response.hits.hits.map(function(hit){
	        	        jsonld.items.push(hit._source);
	            });
	        if (response.hits.hits.length === 5000){
	        	    var nextPage = Number(req.params.id) + Number(1);
	        		jsonld['next'] = {};
        	        jsonld['next']['type'] = 'CollectionPage';
        	        jsonld['next']['id'] = 'http://52.204.112.237:3051/activity-stream/' + nextPage;
	        }
	        if (req.params.id > 1){
	        	var previousPage = Number(req.params.id) - Number(1);
	        	jsonld['previous'] = {};
	        	jsonld['previous']['type'] = 'CollectionPage';
	        	jsonld['previous']['id'] = 'http://52.204.112.237:3051/activity-streams/' + previousPage;
	        }
        }
        else {
          var total = response.count;
          var last = Number(total) / Number(5000);
        	  var jsonld = {};
        	  jsonld['@context'] = [];
        	  jsonld['@context'].push('http://iiif.io/api/presentation/3/context.json');
        	  jsonld['@context'].push('https://www.w3.org/ns/activitystreams');
        	  jsonld['id'] = 'http://52.204.112.237:3051/activity-streams/';
        	  jsonld['type'] = 'Collection';
        	  jsonld['label'] = 'CONTENTdm IIIF Collections';
        	  jsonld['first'] = {};
        	  jsonld['first']['id'] = 'http://52.204.112.237:3051/activity-streams/1';
        	  jsonld['first']['type'] = 'CollectionPage';
        	  if (last % 1 != 0){
                  var lastPage = Math.floor(last + 1);
                  jsonld['last'] = {};
                  jsonld['last']['id'] = 'http://52.204.112.237:3051/activity-streams/'+lastPage;
                  jsonld['last']['type'] = 'CollectionPage';
              }
              else{
                  var lastPage = Math.floor(last);
                  jsonld['last'] = {};
                  jsonld['last']['id'] = 'http://52.204.112.237:3051/activity-streams/'+last;
                  jsonld['last']['type'] = 'CollectionPage'; 
              }
        }
        	
        obj.json = JSON.stringify(jsonld);
	    sendResponse(res,obj);
      }
}

function doPagingSearch(req, res, obj, requestPage) {
	var currentPage = 0;
    client.search(obj,function getRightPage(error, response, status) {
    	currentPage += 1;
    	console.log('requested page ' + requestPage);
    	console.log('curent page ' + currentPage);
    	if (requestPage != currentPage) {
    		console.log('still in search loop');
    		client.scroll({
    		      scrollId: response._scroll_id,
    		      scroll: '10s'
    		    }, getRightPage);
    		  } else {
    			console.log('should be done');
    			//console.log(response);
    		    	handleResponse(req, res,error, response);
    		  }
      });
}

function doCount(req, res,obj) {
    client.count(obj,function (error, response, status) {
    	handleResponse(req, res,error, response);
      });
}


// for all requests
app.all('/*', function(req, res, next) {

	  // enable CORS if configuration says to
	  if (config.cors.enabled) {
	    res.header("Access-Control-Allow-Origin", config.cors.sites);
	    res.header("Access-Control-Allow-Methods", config.cors.methods);
	    res.header("Access-Control-Allow-Headers", config.cors.headers);
	  }
	  
	  // set caching 
	  res.setHeader('Cache-Control', 'public, max-age=31557600');
	  // intercept OPTIONS method
	  if ('OPTIONS' === req.method) {
	    res.send(200);
	  } else {
	    next();
	  }
	  
	});

// handle GET request patterns
app.get('/:collection/:id?', function (req, res) {
	        const params = req.params;
	        console.log(req.params.collection);
	        console.log(req.params.id);
            var sizeNum = 500;
         
            // get result starting position
            var fromNum = 0;
            
            if (req.params.collection === "activity-streams"){
        	        console.log('collection is right')
	        	   if (req.params.id){
	        		  console.log('there is an id');
	        		  query = "*";
	        		  var sizeNum = 5000;
	        	      var requestPage = req.params.id; 		  
	        		  // build query
	        		  bodyObject = {};
	              bodyObject.query = {};
	              bodyObject.query.function_score = {};
	              bodyObject.query.function_score.query = {};
	              bodyObject.query.function_score.query.query_string = {};
	              bodyObject.query.function_score.query.query_string.query = query;
	              bodyObject.size = sizeNum;
	              //console.log(JSON.stringify(bodyObject))
	        		  
	              // send the search and handle the elasticsearch response
	              doPagingSearch(req, res,{  
	            	  	index: config.indexName,
	                  type: config.docType,
	                  scroll: '10s',
	                  body: bodyObject
	                }, requestPage);
	        		  
	        	  }  else  {
	              console.log('in else')
	        		  doCount(req, res,{  
	              	  index: config.indexName,
	                  type: config.docType
	                })
	      
	        }
        }
  
});

//If no route is matched by now, it must be an invalid request
app.use(function(req, res) {
	console.log('failed here')
  sendResponse(res,config.errorObject["400"]);
});

http.createServer(app).listen(config.appPort, function(){
  console.log('Express server listening on port ' + config.appPort);
});

