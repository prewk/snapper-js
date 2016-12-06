// @flow

const Ajv = require('ajv');
const flattenDeep = require('lodash/flattenDeep');
const masterSchema = require('snapper-schema');
const getEntityByName = require('../schema/get-entity-by-name');
const validateField = require('./validate-field');

const ajv = new Ajv();
const schemaValidator = ajv.compile(masterSchema);

/**
 * Validates a snapshot against its schema and returns a collection of errors messages
 */
function validate(schema: Schema, entities: Snapshot): Array<string> {
    if (!schemaValidator(schema)) {
        return schemaValidator.errors;
    }

    return flattenDeep(entities.map((entity: EntityRow) =>
        getEntityByName(schema, entity.name).fields.map((field) =>
            validateField(field, entity.fields, entities)
        )
    ));
}

module.exports = validate;