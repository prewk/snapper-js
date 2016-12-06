const countBy = require('lodash/countBy');
const getTaskDependencies = require('../get-task-dependencies');

/**
 * Sort snapshot entities by most required
 */
function sort(idMaker, entities, tasks) {
    const allDeps = tasks.reduce((allDeps, task) => {
        getTaskDependencies(task).forEach(id => {
            // Translate from task id to real id
            allDeps.push(idMaker.getEntity(id)[1]);
        });

        return allDeps;
    }, []);

    const count = countBy(allDeps);

    const withDeps = entities.filter(entityRow => count.hasOwnProperty('' + entityRow.key));
    const withoutDeps = entities.filter(entityRow => !count.hasOwnProperty('' + entityRow.key));

    return withDeps.sort((a, b) => {
        const aId = '' + a.key;
        const bId = '' + b.key;

        const aCount = count[aId];
        const bCount = count[bId];

        if (aCount === bCount) {
            if (aId === bId) return 0;

            return aId < bId ? -1 : 0;
        }

        return aCount < bCount ? -1 : 1;
    }).concat(withoutDeps);
}

module.exports = sort;