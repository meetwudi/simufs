var config = require('./conf'),
    fs = require('fs'),
    path = require('path');

function Block(id) {
  this.filepath = path.join(__dirname, 'local', id + '.bin');
  this.binData = new Buffer(config.BLOCK_SIZE);
  this.wipe();
  // 这里所有的二进制数据都被填成0，IO模块需要
  // 调用sync方法来更新所有的数据
}

/**
 * Read data from corresponding hard disk file
 */
Block.prototype.sync = function(callback) {
  var stream = fs.createReadStream(this.filepath),
      that = this;
  callback = callback || function() {};
  stream.on('data', function(chunk) {
     that.binData = Buffer.concat([that.binData, chunk], config.BLOCK_SIZE); 
  });
  stream.on('error', callback);
  stream.on('end', callback);
};

/**
 * Write data to corresponding hard disk file
 */
Block.prototype.update = function(callback) {
  var stream = fs.createWriteStream(this.filepath);
  callback = callback || function() {};
  stream.write(this.binData, callback);
};

/**
 * Wipe all data in this block
 */
Block.prototype.wipe = function() {
  this.binData.fill(0);
};


module.exports = Block;
