var config = require('./conf'),
    Block = require('./Block'),
    blocks = [],
    io = {},
    cli = require('../util/cli');

/**
 * 初始化所有的block，并且让它们从磁盘同步内容
 */
io.init = function(callback) {
    var i, 
        block, 
        cnt = 0;
    cli.report('正在初始化物理块');
    for (i = 0; i < config.BLOCK_CNT; i ++) {
        block = new Block(i);
        blocks.push(block);
        block.sync(function() {
            cnt ++;
            if (cnt === config.BLOCK_CNT - 1) {
                cli.report('初始化物理块完成');
                callback();
            }
        });
    }
};

/**
 * 从第startBlock块读数据，连续读length个块
 */
io.read = function (startBlock, length) {
    var result = new Buffer(0),
        i;
    for (i = startBlock; i < startBlock + length; i ++) {
        result = Buffer.concat([result, blocks[i].binData]);
    }
    return result;
};

/**
 * 从第startBlock块写数据，最多连续写length个块
 */
io.write = function (startBlock, length, data) {
    var buf = new Buffer(data),
        i = startBlock;
    while (buf.length > 0 && i < startBlock + length) {
        blocks[i ++].binData = buf.slice(0, config.BLOCK_SIZE);
        buf = buf.slice(config.BLOCK_SIZE);
    }
    while (i < startBlock + length) {
        blocks[i ++].binData.fill(0);
    }
}

/**
 * 将所有数据写回硬盘
 */
io.update = function (callback) {
    callback = callback || function() {};
    cli.report('保存系统数据中');
    (function doUpdate(i) {    
        blocks[i].update(function() {
            if (i === config.BLOCK_CNT - 1) {
                cli.report('系统数据保存完毕');
                callback();
            }
            else {
                doUpdate(i + 1);
            }
        });
    })(0);
};

module.exports = io;

