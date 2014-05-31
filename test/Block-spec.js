var Block = require('../dev/Block'),
  thunkify = require('thunkify'),
  co = require('co'),
  _fs = require('fs'),
  fs = {
    readFile: thunkify(_fs.readFile)
  },
  path = require('path'),
  bufferHelper = require('../util/buffer-helper'),
  block;

describe('Block', function() {
  beforeEach(function() {
    block = new Block(7010);
  });

  it('should be able to update data', function(done) {
    co(function*() {
      block.binData = new Buffer('Hello, world~');
      yield thunkify(block.update).call(block);
      var result = yield fs.readFile(path.join(__dirname, '../dev/local/7010.bin'));
      result.toString().should.eql('Hello, world~');
    })(done);
  });

  it('should be able to sync data', function(done) {
    co(function*() {
      yield thunkify(block.sync).call(block);
      var data = block.binData;
      data = bufferHelper.trim(data).toString();
      data.should.eql('Hello, world~');
    })(done);
  });
});