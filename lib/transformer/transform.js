const getEntityByName = require('../schema/get-entity-by-name');
const getMorphTable = require('../schema/get-morph-table');
const transformField = require('./transform-field');

/**
 * Transform the given entities with the given transformer
 */
function transform(schema, entities, transformer) {
    const morphTable = getMorphTable(schema);

    return entities.map(entityRow => {
        const fields = getEntityByName(schema, entityRow.name).fields;

        return Object.assign({}, entityRow, {
            key: transformer(entityRow.name, entityRow.key),
            fields: fields.reduce((transformedFields, field) => {
                return Object.assign(transformedFields, transformField(field, entityRow.fields, (name, id) => {
                    if (morphTable.hasOwnProperty(name)) {
                        name = morphTable[name];
                    }

                    return transformer(name, id);
                }));
            }, {})
        });
    });
}

module.exports = transform;