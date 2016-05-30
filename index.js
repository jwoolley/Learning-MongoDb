var mongodb = require('mongodb');
var Promise = require('bluebird');
var utils = require('./lib/utils');

var MongoClient = mongodb.MongoClient;

var globals = {
  config: {}
};

openMongo()
  .then(connection => {
    this.connection = connection;
  })
  .finally(() =>  {
    this.connection.close(); 
  });



function loadConfig(configName) {
  var configPath = './config/';
  var overridePath = configPath + 'overrides/';
  var _config = configPath + configName + '.json';
  var _override = overridePath + configName + '.json';

  if (globals.config.hasOwnProperty(configName)) {
    return Promise.resolve(config[configName]);
  }

  return utils.readFile(_override)
    .then(undefined, () => utils.readFile(_config))
    .then(data => {  globals.config[configName] = data; });
}

function openMongo() {
  return new Promise(function(resolve, reject) {
   return loadConfig('mongo')
    .then(() => {   
      var config = globals.config.mongo;

      var url = 'mongodb://' + config.host + ':' + config.port + '/' + config.dbName;

      MongoClient.connect(url, function(err, db) {
        if(err) {
          reject(new Error(err));
        } else { 
          console.log('Connection established to ' + url);
          resolve(db);
        }
      });    
    });
  });
}