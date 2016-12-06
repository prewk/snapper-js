// @flow

const flattenDeep = require('lodash/flattenDeep');
const uniq = require('lodash/uniq');
const getTaskValueDependencies = require('./get-task-value-dependencies');

/**
 * Get all dependencies for a given task
 */
function getTaskDependencies(task: Task): Array<number> {
    return uniq(flattenDeep(task.values.map(getTaskValueDependencies)));
}

module.exports = getTaskDependencies;