'use strict';

module.exports = encode;

/**
 * Encodes a .
 * @param {object} a Carmen GeoJSON: https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
 * @returns {array} first element is a URL encoded address, second element is a country code
 */
function encode(a) {
  if (!a.Address) {
    var address = [ 'NODATA', '' ];
  } else {
    var address = [ encodeURIComponent(a.Address + ' ' + a.City + ' ' + a.State + ' ' + a.Zipcode), a.Country.toLowerCase() ];
  }
  
  return address;
}