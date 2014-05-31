function FCB(type, filename, startBlock, size) {
  this.crd = Date.now();
  this.upd = Date.now();
  this.t = type;
  this.id = filename;
  this.blk = startBlock;
  this.len = size;
}

module.exports = FCB;