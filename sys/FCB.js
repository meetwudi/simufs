function FCB(type, filename, startBlock, size, thisBlock) {
  this.crd = Date.now();
  this.upd = Date.now();
  this.t = type;
  this.id = filename;
  this.blk = startBlock;
  this.len = size;
  this.thisBlock = thisBlock;
}

module.exports = FCB;