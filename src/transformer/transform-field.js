// @flow

const transformValue = require('../schema/value-field').transform;
const transformBelongsTo = require('../schema/belongs-to-field').transform;
const transformMap = require('../schema/map-field').transform;
const transformMorphTo = require('../schema/morph-to-field').transform;
const transformMatch = require('../schema/match-field').transform;

/**
 * Transform a field
 */
function transformField(
    schema: Field,
    fields: { [key: string]: any },
    transformer: (name: string, id: string | number) => string | number
): { [key: string]: any } {
    switch (schema.type) {
        case 'VALUE':
            return transformValue(schema, fields, transformer);
        case 'BELONGS_TO':
            return transformBelongsTo(schema, fields, transformer);
        case 'MAP':
            return transformMap(schema, fields, transformer);
        case 'MORPH_TO':
            return transformMorphTo(schema, fields, transformer);
        case 'MATCH':
            return transformMatch(schema, fields, transformer, transformField);
        default:
            throw new Error(`Invalid field type: ${schema.type}`);
    }
}

module.exports = transformField;