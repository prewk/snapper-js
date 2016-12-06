const hasEntity = require('../snapshot/has-entity');
const getValueWithFallback = require('./get-value-with-fallback');

/**
 * Validate a BelongsTo field
 */
function validate(schema, fields, entities) {
    const value = getValueWithFallback(schema, fields);

    if (typeof value === 'string' || typeof value === 'number') {
        if (!hasEntity(entities, schema.foreignEntity, value)) {
            return [`Couldn't find the required relation for ${ schema.name }`];
        }
    }

    return [];
}

/**
 * Transform a BelongsTo field
 */
function transform(schema, fields, transformer) {
    const transformed = {};

    if (fields.hasOwnProperty(schema.name)) {
        transformed[schema.name] = transformer(schema.foreignEntity, fields[schema.name]);
    }

    return transformed;
}

/**
 * Compile field
 */
function compile(schema, idMaker, fields, forceCircularFallback = false) {
    const value = getValueWithFallback(schema, fields);
    const compiled = {};

    compiled[schema.localKey] = forceCircularFallback ? { type: 'TASK_RAW_VALUE', value: schema.circularFallback } : { type: 'TASK_ALIAS', alias: idMaker.getId(schema.foreignEntity, value) };

    return compiled;
}

exports.compile = compile;
exports.validate = validate;
exports.transform = transform;