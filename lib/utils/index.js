var Promise = require('bluebird');
var fs = require('fs');

module.exports = {
  fileExists: fileExists,
  readFile: readFile
};

function fileExists(path) {
  return new Promise(function (resolve, reject) {
    return fs.exists(path, function(exists) { 
      resolve(exists);
    });
  });
}

function readFile(path, encoding) {
  var encoding = encoding ? encoding : 'utf8';
  console.log('path: ' + path + '; encoding ' + encoding);
  return new Promise(function (resolve, reject) {
    return fileExists(path)
      .then(exists => {
        console.log('exists? ' + exists);
        if (!exists) {
          reject(new Error('Unable to read file ' + path + ': file doesn\'t exist'));
        }

        return fs.readFile(path, encoding, function(err, data) { 
          if (err) {
            reject(err);
          } else {
            try {
              var data = JSON.parse(data);   
              console.log('file contents: ' + JSON.stringify(data, null, '\t'));
              resolve(data);
            } catch (e)  {
              reject(e);
            }
          }
        });
      })
  });
}