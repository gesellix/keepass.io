var path = require('path');

exports.abspath = function abspath(dirPath) {
    return path.join(__dirname, 'data', dirPath);
};