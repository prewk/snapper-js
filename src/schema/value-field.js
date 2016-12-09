// @flow

const getValueWithFallback = require('./get-value-with-fallback');
const IdMaker = require('../compiler/id-maker');

/**
 * Cast a value
 */
function cast(schema: ValueField, value: any): any {
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
function validate(schema: ValueField, fields: { [key: string]: any }): Array<string> {
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
function transform(
    schema: ValueField,
    fields: { [key: string]: any }
): { [key: string]: any } {
    const transformed = {};

    if (fields.hasOwnProperty(schema.name)) {
        transformed[schema.name] =  fields[schema.name];
    }

    return transformed;
}

/**
 * Compile field
 */
function compile(
    schema: ValueField,
    idMaker: IdMaker,
    fields: { [key: string]: any },
    forceCircularFallback: boolean = false
): { [key: string]: any } {
    const compiled = {};

    compiled[schema.name] = forceCircularFallback
        ? { type: 'TASK_RAW_VALUE', value: schema.circularFallback }
        : { type: 'TASK_RAW_VALUE', value: getValueWithFallback(schema, fields) };
    
    return compiled;
}

exports.compile = compile;
exports.cast = cast;
exports.validate = validate;
exports.transform = transform;