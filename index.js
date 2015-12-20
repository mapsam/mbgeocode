'use strict';

var fs = require('fs'),
    parse = require('csv-parse'),           // open and read csv
    geocode = require('./src/geocode.js'),  // geocode an address
    color = require('colors');

module.exports = function(file, token, callback) {

  // var parser = 
  // });

  fs.readFile(file, 'utf8', function(err, csv) {
    if (err) throw err;

    parse(csv, {columns: true}, function(err, output) {
      if (err) throw err;

      geocode(output, token, function(err, geojson) {
        if (err) throw err;

        callback(null, geojson);
      });
    });
  });

  // input.pipe(parser);
};

