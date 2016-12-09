// @flow

const hasEntity = require('../snapshot/has-entity');
const getValueWithFallback = require('./get-value-with-fallback');
const IdMaker = require('../compiler/id-maker');

/**
 * Validate a BelongsTo field
 */
function validate(schema: BelongsToField, fields: { [key: string]: any }, entities: Snapshot): Array<string> {
    const value = getValueWithFallback(schema, fields);

    if (typeof value === 'string' || typeof value === 'number') {
        if (!hasEntity(entities, schema.foreignEntity, value)) {
            return [`Couldn't find the required relation for ${schema.name}`];
        }
    }

    return [];
}

/**
 * Transform a BelongsTo field
 */
function transform(
    schema: BelongsToField,
    fields: { [key: string]: any },
    transformer: (name: string, id: string | number) => string | number
): { [key: string]: any } {
    const transformed = {};

    if (fields.hasOwnProperty(schema.name)) {
        transformed[schema.name] =  transformer(schema.foreignEntity, fields[schema.name]);
    }

    return transformed;
}

/**
 * Compile field
 */
function compile(
    schema: BelongsToField,
    idMaker: IdMaker,
    fields: { [key: string]: any },
    forceCircularFallback: boolean = false
): { [key: string]: any } {
    const value = getValueWithFallback(schema, fields);
    const compiled = {};

    compiled[schema.localKey] = forceCircularFallback
        ? { type: 'TASK_RAW_VALUE', value: schema.circularFallback }
        : { type: 'TASK_ALIAS', alias: idMaker.getId(schema.foreignEntity, value) };
    
    return compiled;
}

exports.compile = compile;
exports.validate = validate;
exports.transform = transform;