const compileField = require('./compile-field');

/**
 * Make a CreateTask
 */
function makeCreateTask(idMaker, entitySchema, entityRow, problematicFields = []) {
    const id = idMaker.getId(entityRow.name, entityRow.key);

    let columns = [];
    let values = [];
    const nameToColumnMap = {};

    entitySchema.fields.forEach(field => {
        const compiledField = compileField(field, idMaker, entityRow.fields, problematicFields.includes(field.name));

        const compiledColumns = Object.keys(compiledField);

        columns = columns.concat(compiledColumns);
        values = values.concat(Object.keys(compiledField).map(key => compiledField[key]));
        nameToColumnMap[field.name] = compiledColumns;
    });

    return [{
        type: 'CREATE_TASK',
        entity: entityRow.name,
        alias: id,
        columns,
        values
    }, nameToColumnMap];
}

module.exports = makeCreateTask;