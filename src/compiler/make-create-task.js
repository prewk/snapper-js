//@flow

const compileField = require('./compile-field');
const IdMaker = require('../compiler/id-maker');

/**
 * Make a CreateTask
 */
function makeCreateTask(
    idMaker: IdMaker,
    entitySchema: Entity,
    entityRow: EntityRow,
    problematicFields: Array<string> = []
): [CreateTask, { [key: string]: Array<string> }] {
    const id = idMaker.getId(entityRow.name, entityRow.key);

    let columns = [];
    let values = [];
    const nameToColumnMap = {};

    entitySchema.fields.forEach((field) => {
        const compiledField = compileField(
            field,
            idMaker,
            entityRow.fields,
            problematicFields.includes(field.name)
        );

        const compiledColumns = Object.keys(compiledField);

        columns = columns.concat(compiledColumns);
        values = values.concat(Object.keys(compiledField).map((key) => compiledField[key]));
        nameToColumnMap[field.name] = compiledColumns;
    });

    return [{
        type: 'CREATE_TASK',
        entity: entityRow.name,
        alias: id,
        columns,
        values,
    }, nameToColumnMap];
}

module.exports = makeCreateTask;