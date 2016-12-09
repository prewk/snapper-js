const getValueWithFallback = require('./get-value-with-fallback');
const IdMaker = require('../compiler/id-maker');

/**
 * Cast a value
 */
function cast(schema, value) {
    switch (schema.cast) {
        case 'JSON':
            return JSON.stringify(value);
        case 'INTEGER':
            return parseInt(value, 10);
        case 'FLOAT':
            return parseFloat(value);
        default:
            return value;
    }
}

/**
 * Validate a Value field
 */
function validate(schema, fields) {
    const value = getValueWithFallback(schema, fields);

    try {
        cast(schema, value);
    } catch (err) {
        return [err.message];
    }

    return [];
}

/**
 * Transform field
 */
function transform(schema, fields) {
    const transformed = {};

    if (fields.hasOwnProperty(schema.name)) {
        transformed[schema.name] = fields[schema.name];
    }

    return transformed;
}

/**
 * Compile field
 */
function compile(schema, idMaker, fields, forceCircularFallback = false) {
    const compiled = {};

    compiled[schema.name] = forceCircularFallback ? { type: 'TASK_RAW_VALUE', value: schema.circularFallback } : { type: 'TASK_RAW_VALUE', value: getValueWithFallback(schema, fields) };

    return compiled;
}

exports.compile = compile;
exports.cast = cast;
exports.validate = validate;
exports.transform = transform;