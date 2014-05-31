var diskmgr = require('../sys/diskmgr');

describe('Disk Manager', function() {
  it('should be able to find a free space', function(done) {
    diskmgr.init(function() {
      var freeStart = diskmgr.queryFreeSpace(10);
      freeStart.should.be.eql(257);
      diskmgr.update(done);
    });
  });

  it('should be able to alloc space and dealloc space', function(done) {
    diskmgr.init(function() {
      diskmgr.alloc(257, 10);
      diskmgr.queryFreeSpace(10).should.be.eql(267);
      diskmgr.free(257, 10);
      diskmgr.queryFreeSpace(10).should.be.eql(257);
      done();
    });
  });
});