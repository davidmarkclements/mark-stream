var path = require('path');
var test = require('tape');
var concatStream = require('concat-stream');
var fs = require('fs');
var markStream = require('../');
var example = path.join(__dirname, 'example.md');


test('Simple test to ensure we get output', function (t) {
  t.plan(1);

  var example = path.join(__dirname, 'example.md');

  var stream = fs.createReadStream(example)
    .pipe(markStream())
    .pipe(require('JSONStream').stringify())

  stream.pipe(process.stdout)

  stream.on('error', function (err) {
    console.log(err);
    t.fail(err);
  });

  var concat = concatStream(function (data) {

    t.ok(data, 'Received all data');
  });

  


  stream.pipe(concat);

});
