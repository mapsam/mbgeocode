'use strict';

module.exports = slim;

/**
 * Slims down a Carmen GeoJSON to a small, useable geojson - uses the first result returned.
 * @param {object} a Carmen GeoJSON: https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
 * @returns {object} a geojson
 */
function slim(carmengj) {
  var feature = {
    type: 'Feature',
    geometry: carmengj.features[0].geometry,
    properties: carmengj.features[0].properties
  };

  feature.properties['mapbox_places_id'] = carmengj.features[0].id;
  feature.properties['place_name'] = carmengj.features[0].place_name;

  return feature;
}