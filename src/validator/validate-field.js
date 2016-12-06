// @flow

const validateValue = require('../schema/value-field').validate;
const validateBelongsTo = require('../schema/belongs-to-field').validate;
const validateMap = require('../schema/map-field').validate;
const validateMorphTo = require('../schema/morph-to-field').validate;
const validateMatch = require('../schema/match-field').validate;

/**
 * Validate a field value using its schema
 */
function validateField(schema: Field, fields: { [key: string]: any }, entities: Snapshot): Array<string> {
    switch (schema.type) {
        case 'VALUE':
            return validateValue(schema, fields, entities);
        case 'BELONGS_TO':
            return validateBelongsTo(schema, fields, entities);
        case 'MAP':
            return validateMap(schema, fields, entities);
        case 'MORPH_TO':
            return validateMorphTo(schema, fields, entities);
        case 'MATCH':
            return validateMatch(schema, fields, entities, validateField);
        default:
            throw new Error(`Invalid field type: ${schema.type}`);
    }
}

module.exports = validateField;