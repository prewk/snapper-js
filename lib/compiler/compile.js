const IdResolver = require('./id-resolver');
const IdMaker = require('./id-maker');
const getEntityByName = require('../schema/get-entity-by-name');
const makeCreateTask = require('./make-create-task');
const getTaskDependencies = require('./get-task-dependencies');
const getTaskValueDependencies = require('./get-task-value-dependencies');
const getFieldName = require('./get-field-name');
const sortByMostRequired = require('./sorters/sort-by-most-required');

/**
 * Make an UpdateTask from a CreateTask
 */
function toUpdateTask(task, schema, problematicColumns) {
    const updateColumns = [];
    const updateValues = [];

    task.columns.forEach((column, index) => {
        if (problematicColumns.includes(column)) {
            updateColumns.push(column);
            updateValues.push(task.values[index]);
        }
    });

    return {
        type: 'UPDATE_TASK',
        entity: task.entity,
        alias: task.alias,
        keyName: schema.key.name,
        columns: updateColumns,
        values: updateValues
    };
}

/**
 * Compile a snapshot using a schema into a TaskSequence
 */
function compile(idMaker, idResolver, schema, entities) {
    const createTasks = [];
    const updateTasks = [];

    // Pre-compile optimization - sort the entities
    const unsortedCreateTasks = entities.map(entityRow => makeCreateTask(idMaker, getEntityByName(schema, entityRow.name), entityRow)[0]);

    entities = sortByMostRequired(idMaker, entities, unsortedCreateTasks);

    // Compile
    entities.forEach(entityRow => {
        const entitySchema = getEntityByName(schema, entityRow.name);
        let [createTask, nameToColumnMap] = makeCreateTask(idMaker, entitySchema, entityRow);
        const id = createTask.alias;
        let taskDeps = getTaskDependencies(createTask);

        const circularDeps = idResolver.findCircularDeps(id, taskDeps);

        if (circularDeps.length) {
            const problematicFields = [];
            const problematicColumns = [];

            createTask.values.forEach((value, index) => {
                let isProblematic = false;
                getTaskValueDependencies(value).forEach(valueDep => {
                    if (circularDeps.includes(valueDep)) {
                        // This TaskValue has a circular dependency
                        isProblematic = true;
                    }
                });

                if (isProblematic) {
                    problematicColumns.push(createTask.columns[index]);
                    problematicFields.push(getFieldName(nameToColumnMap, createTask.columns[index]));
                }
            });

            if (!problematicFields.length) {
                throw new Error('Internal error: Couldn\'t find problematic fields when sorting out a circular dependency');
            }

            // The original CreateTask should be an UpdateTask instead
            updateTasks.push(toUpdateTask(createTask, entitySchema, problematicColumns));

            // Re-create the CreateTask with fewer deps
            [createTask] = makeCreateTask(idMaker, entitySchema, entityRow, problematicFields);
            taskDeps = getTaskDependencies(createTask);
        }

        if (taskDeps.length) {
            idResolver.listen(id, taskDeps, () => {
                createTasks.push(createTask);
                idResolver.report(createTask.alias);
            });
        } else {
            createTasks.push(createTask);
            idResolver.report(createTask.alias);
        }
    });

    // Merge creates and updates into one sequence
    const sequence = createTasks.concat(updateTasks);

    if (createTasks.length !== entities.length) {
        throw new Error('Snapshot uncompilable - can\'t resolve all dependency trees');
    }

    return sequence;
}

module.exports = compile;