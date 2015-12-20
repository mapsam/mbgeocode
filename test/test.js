'use strict';

var test = require('tap').test;
var mbgeocode = require('../index.js');

test('csv > geojson', function (t) {
  mbgeocode('./test/fixtures/data.csv', 'pk.eyJ1Ijoic3ZtYXR0aGV3cyIsImEiOiJVMUlUR0xrIn0.NweS_AttjswtN5wRuWCSNA', function(err, result) {
    t.ifError(err);
    console.log(result);

    // general structure
    t.deepEqual(result.type, 'FeatureCollection');

    // catches empty row
    t.equal(result.features.length, 2);

    // successful feature
    t.deepEqual(result.features[0].properties.mapbox_places_id, 'address.6107040279534636');
    t.deepEqual(result.features[0].geometry, {
      type: 'Point',
      coordinates: [-92.966527,45.040135]
    });
    t.end();
  });


});