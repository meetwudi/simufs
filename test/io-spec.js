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
    var buf = io.read(7000, 2);
    bufferHelper.trim(buf).toString();
    done();
  });

  it('should be able to write data to multiple blocks', function(done) {
    var text = 'Hello, I am John Wu';
    io.write(7000, 2, text);
    var str = bufferHelper.trim(io.read(7000, 2)).toString();
    str.should.be.eql(text); 
    done();
  });

  it('should be able to write and read a JSON object', function(done) {
    var obj = { key: 'value' };
    io.write(7002, 3, JSON.stringify(obj));
    var objstr = bufferHelper.trim(io.read(7002, 3)).toString();
    var parsed = JSON.parse(objstr);
    parsed.should.have.keys(['key']);
    parsed['key'].should.eql('value');
    done();
  });
});