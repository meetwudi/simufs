var io = require('../dev/io'),
  diskmgr = {};

diskmgr.online = false;

/**
 * 在管理器中启动IO
 */
diskmgr.init = function(callback) {
  if (diskmgr.online) {
    return callback();
  }
  io.init(function() {
    // 读取空闲块位图
    diskmgr.freelist = JSON.parse(io.readtrim(0, 4).toString());
    diskmgr.online = true;
    callback();
  });
};


/**
 * 申请len个块，从start开始申请
 */
diskmgr.alloc = function(start, len) {
  var i,
    upperBound = diskmgr.freelist.length;
  for (i = start; i < Math.min(start + len, upperBound); i ++) {
    diskmgr.freelist[i] = 1;
  }
};

/**
 * 释放len个块，从start开始释放
 */
diskmgr.free = function(start, len) {
  var i,
    upperBound = diskmgr.freelist.length;
  for (i = start; i < Math.min(start + len, upperBound); i ++) {
    diskmgr.freelist[i] = 0;
  }
};

/**
 * 寻找随机的连续的长度为len的块
 */
diskmgr.queryFreeSpace = function(len) {
  var i, j,
    upperBound = diskmgr.freelist.length;
  // 只能从非系统占用区寻找（256 ~ 7999）
  for (i = 256; i < upperBound; ) {
    j = i;
    while (j < upperBound && diskmgr.freelist[j + 1] === diskmgr.freelist[i]) {
      j ++;
    }
    if (diskmgr.freelist[i] === 0 && j - i + 1 >= len) {
      return i;
    }
    i = j + 1;
  }
  return null;
};

/**
 * 询问从start开始的len块是否都是空闲的
 */
diskmgr.chkFree = function(start, len) {
  var i,
    upperBound = diskmgr.freelist.length;
  for (i = start; i < start + len; i ++) {
    if (i === upperBound || diskmgr.freelist[i] === 1) {
      return false;
    }
  }
  return true;
};

/**
 * 根据FCB获取文件内容
 */
diskmgr.readFile = function(fcb) {
  return JSON.parse(io.readtrim(fcb.blk, fcb.len).toString());
};

/**
 * 同步所有文件
 */
diskmgr.update = function(callback) {
  io.update(callback);
};


module.exports = diskmgr;