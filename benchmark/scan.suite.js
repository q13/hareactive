var Suite = require("./default-suite").Suite;
var most = require("most");
var S = require("../dist/Stream");
var B = require("../dist/Behavior");

var n = 100000;
var testData = [];
var result = 0;

for (var i = 0; i < n; i++) {
    testData[i] = i;
    result += i;
}

function sum(curr, val) {
    return curr + val;
}

function pushArray(arr, ev) {
    for (var i = 0; i < arr.length; ++i) {
        ev.publish(arr[i]);
    }
}

module.exports = Suite("Scan")
  .add("Stream", function(defered) {
    var j = S.empty();
    var s = B.at(S.scanS(sum, 0, j));
    S.subscribe(function(e) {
      if (e === result) {
        defered.resolve();
      }
    }, s);
    var i = 0;
    var l = testData.length;
    pushArray(testData, j);
  }, { defer: true })

  .add("most", function(defered) {
    most
      .from(testData)
      .scan(sum, 0)
      .observe(function(e) {
        if (e === result) {
          defered.resolve();
        }
      });
  }, { defer: true })

  .run({ "async": true });