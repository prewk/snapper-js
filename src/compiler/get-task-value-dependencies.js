// @flow

/**
 * Get task value dependencies
 */
function getTaskValueDependencies(value: TaskValue): Array<number> {
    switch (value.type) {
        case 'TASK_RAW_VALUE':
            return [];
        case 'TASK_ALIAS':
            return [value.alias];
        case 'TASK_ASSEMBLED_ALIAS':
            return value.parts.reduce((deps, [type, , alias]) => {
                if (type === 'ALIAS') {
                    deps.push(alias);
                }

                return deps;
            }, []);
        default:
            throw new Error(`Invalid TaskValue type: ${value.type}`);
    }
}

module.exports = getTaskValueDependencies;