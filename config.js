
var config = {};

config.searchServer = "sanmateo-32.dev.oclc.org";
//config.searchServer = "localhost";
config.searchPort = 9200;
config.appPort = 3061;
config.indexName = 'activity_streams';
config.docType = 'activities';	

config.httpStatus = "200";
config.contentTypes = {};
config.contentTypes.json = "application/json";
config.contentTypes.jsonld = "application/ld+json";
config.contentTypes.plain = "text/plain";
config.contentTypes.html = "text/html";
config.contentTypes.octetstream = "application/octet-stream";

config.action = {};
config.action.range_search = true;
config.action.search = true;
config.action.get = true;
config.action.aggregate = true;
config.action.paging = true;
config.action.count = true;

config.index = {};

config.index.activity_streams = {};
config.index.activity_streams.multi_match = {};
config.index.activity_streams.multi_match.searchType = "phrase_prefix";

config.cacheControl = 'public, max-age=86400';

config.errorObject = {};
config.errorObject["200"] = {};
config.errorObject["200"].status = "200";
config.errorObject["200"].allow = "GET";
config.errorObject["200"].json = "{ \"status\": \"OK\" }";
config.errorObject["200"].contentType = config.contentTypes.json;
config.errorObject["400"] = {};
config.errorObject["400"].status = "400";
config.errorObject["400"].allow = "GET";
config.errorObject["400"].json = "{ \"error\": \"invalid request\" }";
config.errorObject["400"].contentType = config.contentTypes.json;
config.errorObject["401"] = {};
config.errorObject["401"].status = "401";
config.errorObject["401"].allow = "GET";
config.errorObject["401"].json = "{ \"error\": \"unauthorized\" }";
config.errorObject["401"].contentType = config.contentTypes.json;
config.errorObject["404"] = {};
config.errorObject["404"].status = "404";
config.errorObject["404"].allow = "GET";
config.errorObject["404"].json = "{ \"error\": \"resource not found\" }";
config.errorObject["404"].contentType = config.contentTypes.json;
config.errorObject["405"] = {};
config.errorObject["405"].status = "405";
config.errorObject["405"].allow = "GET";
config.errorObject["405"].json = "{ \"error\": \"unsupported method\" }";
config.errorObject["405"].contentType = config.contentTypes.json;
config.errorObject["406"] = {};
config.errorObject["406"].status = "406";
config.errorObject["406"].allow = "GET";
config.errorObject["406"].json = "{ \"error\": \"not acceptable\" }";
config.errorObject["406"].contentType = config.contentTypes.json;
config.errorObject["500"] = {};
config.errorObject["500"].status = "500";
config.errorObject["500"].json = "{ \"error\": \"system error\" }";
config.errorObject["500"].contentType = config.contentTypes.json;

config.cors = {};
config.cors.enabled = true;
config.cors.sites = "*";
config.cors.methods = "GET, POST, OPTIONS";
config.cors.headers = "origin, content-type, authorization, accept, pragma, cache-control";

config.logpath = "/data/logs/bunyan/";

config.service = {};
config.service.read = {};
config.service.write = {};
config.service.update = {};
config.service.run = {};
config.service.authorize = {};

// export config
module.exports = config;