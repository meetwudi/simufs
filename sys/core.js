var diskmgr = require('./diskmgr'),
  io = require('../dev/io'),
  FCB = require('./FCB'),
  core = {},
  currentDirFcb; // 当前文件夹的FCB  

core.init = function(callback) {
  diskmgr.init(function() {
    currentDirFcb = JSON.parse(io.readtrim(4, 1).toString());
    callback();
  });
};

core.getCurrentPath = function() {
  var content = diskmgr.readFile(currentDirFcb);
  return content.cpath;
};

core.createFile = function(filename) {

};

module.exports = core;