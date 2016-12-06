const queryPath = require('./query-path');
const parsePath = require('./parse-path');

/**
 * Get all dependencies for a ListRelationEntry
 */
function getDependencies(relation, map, dotMap) {
    const values = queryPath(parsePath(relation.path), map, dotMap);

    return values.filter(([, key]) => typeof key === 'string' || typeof key === 'number').map(([path, key]) => ({
        name: relation.relation,
        key,
        path,
        isInString: false,
        startPos: 0,
        stopPos: 0
    }));
}

exports.getDependencies = getDependencies;