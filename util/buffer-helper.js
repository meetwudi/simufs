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
    return buffer.slice(0, indexOf(buffer, 0xff) + 1);
}

module.exports = {
    indexOf: indexOf,
    trim: trim
};
