var io = require('./dev/io'),
  path = require('path'),
  fs = require('fs'),
  localDir = path.join(__dirname, 'dev/local'),
  cli = require('./util/cli');

cli.report('开始安装文件系统，之前的文件系统将被覆盖');

var deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { 
                deleteFolderRecursive(curPath);
            } else { 
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

if (fs.existsSync(localDir)) {
  deleteFolderRecursive(localDir);
}
fs.mkdirSync(localDir);

io.init(function() {
  var i;
  // 初始化位图，位图占4个块，为0 ~ 3号块
  cli.report('初始化位图');
  var bitmap = Array.apply(null, new Array(1000)).map(function() { return 0; });
  for (i = 0; i < 5; i ++) { bitmap[i] = 1; }
  bitmap[256] = 1;
  io.write(0, 4, JSON.stringify(bitmap));

  // 根目录的FCB，占一个块，为4号块，目录文件在256号
  // 块，初始长度为一个块。
  cli.report('初始化根目录');
  var rootdir = {t: 'd', id: 'root', blk: 256,
    len: 1, crd: Date.now(), upd: Date.now()  };
  io.write(4, 1, JSON.stringify(rootdir));
  io.write(256, 1, JSON.stringify({cpath:'/',fb:null,d:[]}));

  io.update(function() {
    cli.report('安装完成');
  });
});