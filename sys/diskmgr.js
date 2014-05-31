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
 * 保存FreeList到磁盘
 */
diskmgr.syncFreeList = function() {
  io.write(0, 4, JSON.stringify(diskmgr.freelist));
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
  diskmgr.syncFreeList();
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
  diskmgr.syncFreeList();
};

/**
 * 寻找随机的连续的长度为len的块
 */
diskmgr.queryFreeSpace = function(len, start) {
  var i, j,
    upperBound = diskmgr.freelist.length;
  start = Math.max(256, start || 256);
  // 只能从非系统占用区寻找（256 ~ 7999）
  for (i = start; i < upperBound; ) {
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
  return io.readtrim(fcb.blk, fcb.len).toString();
};

/**
 * 写文件（io.write别名）
 */
diskmgr.write = io.write;

/**
 * 同步所有文件
 */
diskmgr.update = function(callback) {
  io.update(callback);
};


module.exports = diskmgr;