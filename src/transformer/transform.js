// @flow

const getEntityByName = require('../schema/get-entity-by-name');
const getMorphTable = require('../schema/get-morph-table');
const transformField = require('./transform-field');

/**
 * Transform the given entities with the given transformer
 */
function transform(
    schema: Schema,
    entities: Snapshot,
    transformer: (name: string, id: string | number) => string | number
): Snapshot {
    const morphTable = getMorphTable(schema);

    return entities.map((entityRow: EntityRow) => {
        const fields = getEntityByName(schema, entityRow.name).fields;

        return Object.assign({}, entityRow, {
            key: transformer(entityRow.name, entityRow.key),
            fields: fields.reduce((transformedFields: { [key: string]: any }, field: Field) => {
                return Object.assign(transformedFields, transformField(field, entityRow.fields, (name: string, id: number | string) => {
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