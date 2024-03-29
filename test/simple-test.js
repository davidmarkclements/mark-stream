var path = require('path');
var test = require('tape');
var concatStream = require('concat-stream');

var markStream = require('../');
var example = path.join(__dirname, 'example.md');


test('Simple test to ensure we get output', function (t) {
  t.plan(1);

  var example = path.join(__dirname, 'example.md');
  var stream = markStream(example).pipe(require('JSONStream').stringify());

  stream.on('error', function (err) {
    console.log(err);
    t.fail(err);
  });

  var concat = concatStream(function (data) {

    t.ok(data, 'Received all data');
  });

  


  stream.pipe(concat);

});
