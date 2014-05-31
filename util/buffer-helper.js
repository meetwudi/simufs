function indexOf(buffer, hex) {
    var i,
        len = buffer.length;
    for (i = 0; i < len; i ++) {
        if (hex === buffer[i]) {
            return i;
        }
    }
    return -1;
}

function trim(buffer) {
    return buffer.slice(0, indexOf(buffer, 0x00));
}

function blockNum(buffer, blockSize) {
    return Math.ceil(buffer.length / blockSize);
}

module.exports = {
    indexOf: indexOf,
    trim: trim
};
