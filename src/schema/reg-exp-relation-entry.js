// @flow

const queryPath = require('./query-path');
const parsePath = require('./parse-path');

/**
 * Cast a found regexp match
 */
function cast(relation: RegExpRelationMatcher, value: any): any {
    switch (relation.cast) {
        case 'INTEGER':
            return parseInt(value, 10);
        case 'STRING':
            return '' + value;
        case 'AUTO':
            return !isNaN(value) ? parseInt(value, 10):  value;
        default:
            return value;
    }
}

/**
 * Get all dependencies for a RegExpRelationEntry
 */
function getDependencies(
    relation: RegExpRelationEntry,
    map: Array<any> | { [key: string]: any },
    dotMap: { [key: string]: any }
): Array<MapEntryDependency> {
    const values = queryPath(parsePath(relation.path), map, dotMap);

    return values
        .reduce((all, [path, value]) => {
            if (!(typeof value === 'string')) {
                return all;
            }

            relation.matchers.forEach((matcher: RegExpRelationMatcher) => {
                const expression = parsePath(matcher.expression);

                if (typeof expression === 'string') {
                    return;
                }

                let match;

                while (match = expression.exec(value)) {
                    for (let i = 0; i < match.length; i++) {
                        if (typeof matcher.relations[i] === 'string') {
                            // The index number is pointing to the outer capture
                            // If this is an inner capture (which it normally is), we need to
                            // offset the starting position
                            // regexp /id:(\d+)/ on 'foobar id:123'
                            // -> match.index = 7
                            // -> match[0] = 'id:123'
                            // -> match[1] = '123'
                            // Offset = 'id:123'.indexOf('123')
                            // Resulting startPos = 7 + 3 = 10
                            // TODO: Algorithm only works for one capture

                            let offset = 0;
                            if (i === 1) {
                                offset = match[0].indexOf(match[1]);
                            } else if (i > 1) {
                                throw new Error(`RegExp expression ${matcher.expression} tries to match too many entities - Only one capture is allowed at the moment`);
                            }

                            all.push({
                                name: matcher.relations[i],
                                key: cast(matcher, match[i]),
                                path,
                                isInString: true,
                                startPos: offset + match.index,
                                stopPos: offset + match.index + ('' + match[i]).length,
                            })
                        }
                    }
                }
            });

            return all;
        }, []);
}

exports.cast = cast;
exports.getDependencies = getDependencies;