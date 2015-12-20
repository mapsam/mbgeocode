'use strict';

module.exports = geocode;

var request = require('request'),
    color = require('colors'),
    progress = require('progress'),
    encode = require('./encode.js'),
    slim = require('./slim.js');

var addresses = {
      type: 'FeatureCollection',
      features: []
    },
    count = 0,
    nodata = 'NODATA',
    api = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

/**
 * This sends a request to the mapbox batch geocoder.
 * @param {string} the formatted string of addresses for the geocoder
 * @param {function} callback function
 */
function geocode(data, token, callback) {
  var bar = new progress('Geocoding [:percent] [:etas] '.grey, {
    total: data.length
  });

  var preparedAddress = encode(data[0]);
  get(preparedAddress); // start with the first

  function get(address) {
    if (address[0] !== nodata) {
      var url = api + address[0] + '.json?country=' + address[1] + '&access_token=' + token;

      request(url, function (error, response, body) {
        console.log('Query: ' + address[0] + ' [' + color.blue(response.statusCode) + ']');
        
        if (error) throw error;
        
        var json = JSON.parse(body);
        
        if (response.statusCode == 200 && json.features && json.features.length > 0) {
          var feature = slim(JSON.parse(body));
          addresses.features.push(feature);

          count++;
          bar.tick();
          if (count < data.length) {
            get(encode(data[count])); // do it again 
          } else {
            callback(null, addresses);
          }
        } else {
          bump();
          if (count < data.length) get(encode(data[count]));
        }
      });
    } else {
      bump();   
      if (count < data.length) get(encode(data[count]));
    }
  }

  function bump() {
    count++;
    bar.tick();
  }
}