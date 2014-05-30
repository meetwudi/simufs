var config = require('./config'),
    Block = require('./Block'),
    thunkify = require('thunkify'),
    co = require('co'),
    blocks = [],
    io = {};

/**
 * 初始化所有的block，并且让它们从磁盘同步内容
 */
io.init = function(callback) {
    co(function*() {
        var i, block;
        for (i = 0; i < config.BLOCK_CNT; i ++) {
            block = new Block(i);
            blocks.push(block);
            yield thunkify(block.sync);
        }
    })(callback);
};

/**
 * 从第startBlock块读数据，连续读length个块
 */
io.read = function (startBlock, length) {
    var result = new Buffer(0),
        i;
    for (i = startBlock; i < startBlock + length; j ++) {
        result = Buffer.concat(result, blocks[i].binData);
    }
    return result;
};

/**
 * 将所有数据写回硬盘
 */
io.update = function (callback) {
    co(function*() {
        var i;
        for (i = 0; i < config.BLOCK_CNT; i ++) {
            yield thunkify(blocks[i].update);
        }
    })(callback);
};

module.exports = io;

