var config = require('./conf'),
  fs = require('fs'),
  path = require('path');

/**
 * 一个Block对象代表一个虚拟磁盘上的物理块
 * @class 物理块
 * @param {integer} id 该物理块的编号
 */
function Block(id) {
  this.id = id;
  this.filepath = path.join(__dirname, 'local', id + '.bin');
  this.binData = new Buffer(config.BLOCK_SIZE);
  this.wipe();
}

/**
 * 将该物理块的数据从真实磁盘上面读取出来，并存放到`binData`中。
 */
Block.prototype.sync = function(callback) {
  if (!fs.existsSync(this.filepath)) {
    return callback();
  }

  var stream = fs.createReadStream(this.filepath),
    that = this,
    offset = 0;
  callback = callback || function() {};

  stream.on('data', function(chunk) {
    chunk.copy(that.binData, offset);
    offset += chunk.length;
  });
  stream.on('error', callback);
  stream.on('end', callback);
};

/**
 * 将binData中的数据写回真实磁盘。
 */
Block.prototype.update = function(callback) {
  fs.writeFile(this.filepath, this.binData.toString(), callback);
};

/**
 * 将binData中的数据全部置0
 */
Block.prototype.wipe = function() {
  this.binData.fill(0);
};


module.exports = Block;
