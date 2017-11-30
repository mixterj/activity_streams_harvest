

# Activity Stream Harvestor



## Usage

Used to harvest [IIIF](http://iiif.io/) [Activity Streams](https://www.w3.org/TR/activitystreams-core/) data data stored in an [ElasticSearch](https://www.elastic.co/products/elasticsearch) index.

## Developing

This is a proof of concept and provided 'as is'.

## Prerequisites
* [Node JS](https://nodejs.org/en/)
* [Express JS](https://expressjs.com/)
* [ElasticSearch](https://www.elastic.co/products/elasticsearch)

## Usage
 ### ElasticSearch
 * [Install ElasticSearch](https://www.elastic.co/downloads/elasticsearch)
 * Use [this code](https://github.com/mixterj/iiif-activity-streams-creation) to create and load IIIF Activity Streams data 
 
 ### Express JS
 * Clone the Repository
 * Modify the config.js file for local setting
 * run `node harvest.js`

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
