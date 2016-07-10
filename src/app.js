/**
 * Pebble.js accelerometer test 1
 *
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Wave = require('wave');


var wind = new UI.Window({
  backgroundColor: 'black'
});
var windSize = wind.size();

var radial = new UI.Radial({
  size: new Vector2(140, 140),
  angle: 70,
  angle2: 290,
  radius: 20,
  backgroundColor: 'cyan',
  borderColor: 'celeste',
  borderWidth: 1,
});
// Center the radial in the window
var radialPos = radial.position()
  .addSelf(windSize)
  .subSelf(radial.size())
  .multiplyScalar(0.5);
radial.position(radialPos);

var textfield = new UI.Text({
  size: new Vector2(140, 60),
  font: 'bitham-42-light',
  text: 'HI!',
  textAlign: 'center'
});
// Center the textfield in the window
var textfieldPos = textfield.position()
  .addSelf(windSize)
  .subSelf(textfield.size())
  .multiplyScalar(0.5);
textfield.position(textfieldPos);

wind.add(radial);
wind.add(textfield);
wind.show();

var THRESHOLD = 10;
var wave = new Wave(THRESHOLD);

wind.on('accelData', function(e) {
  var accelData = e.accels;
  wave.addAccelData(accelData, accelChangeCallback);
});

function accelChangeCallback(move) {
  radial.backgroundColor(move ? 'folly': 'cyan');
}

wind.on('click', 'up', function(e) {
  THRESHOLD += 10;
  wave.setThreshold(THRESHOLD);
  textfield.text(THRESHOLD);
});

wind.on('click', 'down', function(e) {
  if (THRESHOLD > 0) {
    THRESHOLD -= 10;
    wave.setThreshold(THRESHOLD);
    textfield.text(THRESHOLD);
  }
});