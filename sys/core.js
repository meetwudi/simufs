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
  var fcbBlockStart = diskmgr.queryFreeSpace(1),
    fileBlockStart = diskmgr.queryFreeSpace(5, fcbBlockStart + 1); // 文件5个块
  if (fcbBlockStart && fileBlockStart) {
    var fileFcb = new FCB('f', filename, fileBlockStart, 5, fcbBlockStart);
    // 申请空间
    diskmgr.alloc(fcbBlockStart, 1);
    diskmgr.alloc(fileBlockStart, 5);
    // 当前文件夹下面加入这个文件
    currentDir.d.push(fileFcb);
    // 写回磁盘
    core.updateFile(currentDirFcb, JSON.stringify(currentDir));
    // 写文件FCB
    io.write(fcbBlockStart, 1, JSON.stringify(fileFcb));
    // 写文件内容
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
core.getFileFcb = function(filename) {
  var fcb = null;
  currentDir.d.map(function(item) {
    if (item.id === filename && item.t === 'f') {
      fcb = item;
    }
  });
  return fcb;
};

/**
 * 获取文件夹的FCB
 */
core.getDirFcb = function(dirname) {
  var fcb = null;
  currentDir.d.map(function(item) {
    if (item.id === dirname && item.t === 'd') {
      fcb = item;
    }
  });
  return fcb;
};

/**
 * 将制定FCB从当前目录文件的FCB列表中删除
 */
core.deleteFcb = function(fcb) {
  var delIdx = -1;
  currentDir.d.map(function(item, idx) {
    if (item.id === fcb.id) {
      delIdx = idx;
    }
  });
  if (delIdx > -1) {
    currentDir.d.splice(delIdx, 1);
    // 写回磁盘
    core.updateFile(currentDirFcb, JSON.stringify(currentDir));
  }
};

/**
 * 读文件
 */
core.readFile = function(filename) {
  var fcb = core.getFileFcb(filename);
  if (!fcb) {
    return report('不存在该文件，请注意拼写是否正确（大小写敏感）');
  }
  return diskmgr.readFile(fcb);
};

/**
 * 写文件
 */
core.writeFileByName = function(filename, content) {
  var fcb = core.getFileFcb(filename);
  core.writeFile(fcb, content);
};

/**
 * 删除文件
 */
core.unlinkFile = function(filename) {
  var fcb = core.getFileFcb(filename);
  if (!fcb) {
    return report('找不到该文件，无法删除');
  }
  core.deleteFcb(fcb);
  diskmgr.free(fcb.thisBlock, 1);
  diskmgr.free(fcb.blk, fcb.len); 
};

/**
 * 退出系统
 */
core.exit = function() {
  diskmgr.update(function() {
    process.exit();
  });
};

/**
 * 创建文件夹
 */
core.createDir = function(dirname) {
  var fcbBlockStart = diskmgr.queryFreeSpace(1),
    fileBlockStart = diskmgr.queryFreeSpace(5, fcbBlockStart + 1); // 文件5个块
  if (fcbBlockStart && fileBlockStart) {
    var fileFcb = new FCB('d', dirname, fileBlockStart, 5, fcbBlockStart),
      content = {
        cpath: currentDir.cpath + dirname + '/',
        fb: currentDirFcb,
        d: []
      };

    // 申请空间
    diskmgr.alloc(fcbBlockStart, 1);
    diskmgr.alloc(fileBlockStart, 5);
    // 当前文件夹下面加入这个文件
    currentDir.d.push(fileFcb);
    // 写回磁盘
    core.updateFile(currentDirFcb, JSON.stringify(currentDir));
    // 写文件FCB
    io.write(fcbBlockStart, 1, JSON.stringify(fileFcb));
    // 写文件内容
    core.writeFile(fileFcb, JSON.stringify(content));
  }
  else {
    report('空间不足，请释放一些文件');
  }
};

/**
 * 进入文件夹
 */
core.enterDir = function(dirname) {
  var fcb = core.getDirFcb(dirname);
  if (!fcb) {
    return report('找不到该目录，无法进入');
  }
  currentDirFcb = fcb;
  currentDir = JSON.parse(diskmgr.readFile(currentDirFcb));
};

/**
 * 返回上一级文件夹
 */
core.leaveDir = function() {
  if (!currentDir.fb) {
    return report("已经在根目录了");
  }
  currentDirFcb = currentDir.fb;
  currentDir = JSON.parse(diskmgr.readFile(currentDirFcb));
};

/**
 * 获取文件信息（格式化过的）
 */
core.getFileInfo = function(name) {
  var fcb = core.getFileFcb(name) || core.getDirFcb(name),
    content = "";
  content += '文件名： ' + name + '\n';
  content += '文件类型： ' + fcb.t === 'd' ? '目录' : '普通文件' + '\n';
  content += '创建时间： ' + (new Date(fcb.crd)).toString() + '\n';
  content += '文件大小（占用空间）： ' + (fcb.len * 512) + 'B';
  return content;
};

/**
 * 删除目录
 */
core.unlinkDir = function(dirname) {
  var fcb = core.getDirFcb(dirname);
  if (!fcb) {
    return report('找不到该目录，无法删除');
  }
  var content = JSON.parse(diskmgr.readFile(fcb));
  if (content.d.length === 0) {
    return report('目录不为空，无法删除');
  }
  core.deleteFcb(fcb);
  diskmgr.free(fcb.thisBlock, 1);
  diskmgr.free(fcb.blk, fcb.len);   
};

module.exports = core;