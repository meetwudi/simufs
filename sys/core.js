var diskmgr = require('./diskmgr'),
  io = require('../dev/io'),
  FCB = require('./FCB'),
  report = require('../util/cli').report,
  core = {},
  currentDirFcb, // 当前文件夹的FCB
  currentDir; // 当前文件夹的目录文件 

/**
 * 系统初始化
 */
core.init = function(callback) {
  diskmgr.init(function() {
    currentDirFcb = JSON.parse(io.readtrim(4, 1).toString()); // 尚无FCB，因此用io做低级IO
    currentDir = JSON.parse(diskmgr.readFile(currentDirFcb));
    callback();
  });
};


/**
 * 获取当面文件夹的全路径
 * @return {[type]} [description]
 */
core.getCurrentPath = function() {
  return currentDir.cpath;
};

/**
 * 更新文件
 */
core.updateFile = function(fcb, content) {
  diskmgr.write(fcb.blk, fcb.len, content);
};
core.writeFile = core.updateFile;

/**
 * 创建文件
 */
core.createFile = function(filename) {
  var fcbBlock = diskmgr.queryFreeSpace(1),
    fileBlock = diskmgr.queryFreeSpace(5, fcbBlock + 1); // 文件5个块
  if (fcbBlock && fileBlock) {
    var fileFcb = new FCB('f', filename, fileBlock, 5, fcbBlock);
    // 当前文件夹下面加入这个文件
    currentDir.d.push(fileFcb);
    // 写回磁盘
    core.updateFile(currentDirFcb, JSON.stringify(currentDir));
    // 写文件
    core.writeFile(fileFcb, "");
  }
  else {
    report('空间不足，请释放一些文件');
  }
};

/**
 * 列出当前目录下的文件
 */
core.listFiles = function() {
  var result = '文件个数：' + currentDir.d.length + '\n';
  currentDir.d.map(function(item) {
    result += item.id + (item.t === 'd' ? '/' : '') + '\n';
  });
  return result;
};

/**
 * 获取文件的FCB
 */
core.getFcb = function(filename) {
  var fcb = null;
  currentDir.d.map(function(item) {
    if (item.id === filename && item.t === 'f') {
      fcb = item;
    }
  });
  return fcb;
};

/**
 * 读文件
 */
core.readFile = function(filename) {
  var fcb = core.getFcb(filename);
  if (!fcb) {
    return report('不存在该文件，请注意拼写是否正确（大小写敏感）');
  }
  return diskmgr.readFile(fcb);
};

/**
 * 写文件
 */
core.writeFileByName = function(filename, content) {
  var fcb = core.getFcb(filename);
  core.writeFile(fcb, content);
};

/**
 * 退出系统
 */
core.exit = function() {
  diskmgr.update(function() {
    var t = 1;
    process.exit();
  });
};

module.exports = core;