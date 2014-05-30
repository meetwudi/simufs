var io = require('../dev/io'),
  co = require('co'),
  bufferHelper = require('../util/buffer-helper'),
  thunkify = require('thunkify');

describe('IO', function() {
  it('should be able to alloc all blocks', function(done) {
    io.init(done);
  });

  it('should be able to update all blocks to disk', function(done) {
    io.update(done);
  });

  it('should be able to read multiple blocks\' data', function(done) {
    var buf = io.read(1, 2);
    console.log(bufferHelper.trim(buf).toString());
    done();
  });
});