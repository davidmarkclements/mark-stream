var PassThrough = require('stream').PassThrough,
    pygmentize = require('pygmentize-bundled'),
    util = require('util'),
    fs = require('fs'),
    es = require('event-stream'),
    marked = require('marked');

//
// ### @function MarkStream
// #### @path {String} Path to file you want to read
// #### @options {Object} Marked parser options
// Creates a `mark-stream` to recieve a token stream from a path
//
var MarkStream = function (path, options) {
  PassThrough.call(this, {objectMode: true});

  var self = this;
  var rs;

  options = options || {
    gfm: true,
    pedantic: false,
    sanitize: true,
    highlight: function(code, lang, callback) {
      pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
          callback(err, result.toString());
        });
    }
  };

  if (typeof path === 'string') {
    this.pipeline(fs.createReadStream(path, 'utf8'), this._encode.bind(this, options))
  } else {
    this.on('pipe', function (rs) { 
      this.pipeline(rs, this._encode.bind(this, options))
      rs.unpipe(this)
    });
  }



};

//
// Inherit from PassThrough Stream
//
util.inherits(MarkStream, PassThrough);


MarkStream.prototype.pipeline = function pipeline(rs, fn) {
  var self = this;
  rs.pipe(es.split()).on('data', fn)


  rs.on('end', function () {
      self.push(null);
  })
}

//
// ### @private function _encode(options, err, text)
// #### @options {Object} Marked options passed in through partial application
// #### @err {Error} Possible error if bad path is passed in as argument
// #### @text {String} File contents of markdown file
// Continuation after asynchronously reading the file
MarkStream.prototype._encode = function (options, text) {
  var md = marked.lexer(text, options).forEach(function(token){
    this.write(token)
  }, this);
};

//
// Export a new insance of the stream
//
module.exports = function (path, options) {
  return new MarkStream(path,  options);
};
