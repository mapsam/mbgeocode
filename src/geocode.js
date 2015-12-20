'use strict';

module.exports = geocode;

var request = require('request'),
    color = require('colors'),
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
  var preparedAddress = encode(data[0]);
  get(preparedAddress); // start with the first

  function get(address) {
    if (address[0] !== nodata) {
      var url = api + address[0] + '.json?country=' + address[1] + '&access_token=' + token;

      request(url, function (error, response, body) {        
        if (error) throw error;
        
        var json = JSON.parse(body);
        if (response.statusCode == 200 && json.features && json.features.length > 0) {
          log(count, data.length, address[0], response.statusCode);
          
          var feature = slim(JSON.parse(body));
          addresses.features.push(feature);

          count++;
          if (count < data.length) {
            get(encode(data[count])); // do it again 
          } else {
            callback(null, addresses);
          }
        } else {
          log(count, data.length, address[0], response.statusCode);
          count++;
          if (count < data.length) get(encode(data[count]));
        }
      });
    } else {
      log(count, data.length, address[0], 'No address data in row');
      count++;   
      if (count < data.length) get(encode(data[count]));
    }
  }
}

function log(count, total, query, status) {
  console.log('[ '+(count+1)+'/'+total+' ] Query: ' + query + ' [' + color.bold(status) + ']');
}