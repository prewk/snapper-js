

/**
 * Parse a string path into either the same string or a RegExp object
 */
function parsePath(path) {
    if (path.startsWith('/') && path.endsWith('/')) {
        return new RegExp(path.substring(1, path.length - 1), 'g');
    } else {
        return path;
    }
}

module.exports = parsePath;