var ajax = require('ajax');

var Wave = function (thr) {
  this.setThreshold(thr);
  this.isMoving = false;
  this.dburl = 'https://pebble-wave.firebaseio.com/moving.json';
  this.lastData = {x: 0, y: 0, z: -1000};
};

Wave.prototype.sendData = function (data) {
  ajax({ url: this.dburl, type: 'json', method: 'PUT', data: data.toString() },
       function (d) { console.log('success', d);},
       function (d) { console.log('error', d.err);});    
};

Wave.prototype.isOverThreshold = function (dataPoint) {
  return Math.abs(dataPoint.x) > this.THRESHOLD ||
    Math.abs(dataPoint.y) > this.THRESHOLD ||
    Math.abs(dataPoint.z) > this.THRESHOLD;
};

Wave.prototype.isNotVibrating = function (dataPoint) {
  return !dataPoint.vibe;
};

Wave.prototype.updateMoving = function (isMoving, cb) {
  console.log(isMoving);
  this.isMoving = isMoving;
  if (cb) cb(this.isMoving);
  this.sendData(this.isMoving);
};

Wave.prototype.calcChanges = function (dataPoint, i, allData) {
  var prevDataPoint = i ? allData[i-1] : this.lastData;
  return {
    x: dataPoint.x - prevDataPoint.x,
    y: dataPoint.y - prevDataPoint.y,
    z: dataPoint.z - prevDataPoint.z
  };
};

Wave.prototype.addAccelData = function (accelData, cb) {
  accelData = accelData.filter(this.isNotVibrating);
  var accelChanges = accelData.map(this.calcChanges, this);
  var changesAboveThreshold = accelChanges.filter(this.isOverThreshold, this);
  
  this.lastData = accelData[accelData.length-1];
  
  if (changesAboveThreshold.length > 0 && !this.isMoving) {
    this.updateMoving(true);
  } else if (changesAboveThreshold.length === 0 && this.isMoving) {
    this.updateMoving(false);
  }
};

Wave.prototype.setThreshold = function (thr) {
  this.THRESHOLD = thr;
};

module.exports = Wave;
