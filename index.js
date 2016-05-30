var mongodb = require('mongodb');
var utils = require('./lib/utils');

var MongoClient = mongodb.MongoClient;

var config = {};

// TODO: parallelize loading of all configs via list (proise.all)
loadConfig('mongo')
  .then(() => {
   

    var url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbName;

    MongoClient.connect(url, function(err, db) {
      if(err) {
        console.log('Unable to connect to mongoDB server. Error: ' + err);
      } else { 
        console.log('Connection established to ' + url);
        console.log('Bing bong, baby!');
        db.close();
      }
    });    
  });

function loadConfig(configName) {
  var configPath = './config/';
  var overridePath = configPath + 'overrides/';
  var _config = configPath + configName + '.json';
  var _override = overridePath + configName + '.json';

  return utils.readFile(_override)
    .then(undefined, () => utils.readFile(_config))
    .then(data => {  config[configName] = data; });
}