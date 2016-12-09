// @flow

const countBy = require('lodash/countBy');
const getTaskDependencies = require('../get-task-dependencies');
const IdMaker = require('../../compiler/id-maker');

/**
 * Sort snapshot entities by most required
 */
function sort(idMaker: IdMaker, entities: Snapshot, tasks: Array<CreateTask>): Snapshot {
    const allDeps = tasks.reduce((allDeps, task: CreateTask) => {
        getTaskDependencies(task).forEach((id: number) => {
            // Translate from task id to real id
            allDeps.push(idMaker.getEntity(id)[1]);
        });

        return allDeps;
    }, []);

    const count = countBy(allDeps);

    const withDeps = entities.filter((entityRow: EntityRow) => count.hasOwnProperty('' + entityRow.key));
    const withoutDeps = entities.filter((entityRow: EntityRow) => !count.hasOwnProperty('' + entityRow.key));

    return withDeps.sort((a: EntityRow, b: EntityRow) => {
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