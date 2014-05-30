var config = require('./conf'),
    fs = require('fs'),
    path = require('path');

function Block(id) {
  this.filepath = path.join(__dirname, 'local', id + '.bin');
  this.sync();
}

/**
 * Read data from corresponding hard disk file
 */
Block.prototype.sync = function(callback) {
  var stream = fs.createReadStream(this.filepath),
      that = this;
  callback = callback || function() {};
  this.binData = new Buffer(0);
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


module.exports = Block;
