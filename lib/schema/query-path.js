const has = require('lodash/has');
const get = require('lodash/get');

function queryPath(path, map, dotMap) {
    if (typeof path === 'string') {
        if (has(map, path)) {
            const value = get(map, path);

            if (Array.isArray(value)) {
                return value.map((value, i) => [`${ path }.${ i }`, value]);
            } else {
                return [[path, value]];
            }
        }
    }

    return Object.keys(dotMap).reduce((results, key) => {
        const value = dotMap[key];

        if (path instanceof RegExp && path.test(key)) {
            results.push([key, value]);
        } else if (key === path) {
            results.push([key, value]);
        }

        return results;
    }, []);
}

module.exports = queryPath;