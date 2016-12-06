// @flow

const queryPath = require('./query-path');
const parsePath = require('./parse-path');

function getDependencies(
    relation: ValueRelationEntry,
    map: Array<any> | { [key: string]: any },
    dotMap: { [key: string]: any }
): Array<MapEntryDependency> {
    const values = queryPath(parsePath(relation.path), map, dotMap);

    if (values.length && (typeof values[0][1] === 'string' || typeof values[0][1] === 'number')) {
        return [{
            name: relation.relation,
            key: values[0][1],
            path: values[0][0],
            isInString: false,
            startPos: 0,
            stopPos: 0,
        }];
    } else {
        return [];
    }
}

exports.getDependencies = getDependencies;