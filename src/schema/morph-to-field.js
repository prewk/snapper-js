// @flow

const getValueWithFallback = require('./get-value-with-fallback');
const IdMaker = require('../compiler/id-maker');

/**
 * Validate a MorphTo field
 */
function validate(schema: MorphToField, fields: { [key: string]: any }, entities: Snapshot): Array<string> {
    getValueWithFallback(schema, fields);

    return [];
}

/**
 * Transform a MorphTo field
 */
function transform(
    schema: MorphToField,
    fields: { [key: string]: any },
    transformer: (name: string, id: string | number) => string | number
): { [key: string]: any } {
    const transformed = {};

    if (fields.hasOwnProperty(schema.name)) {
        const morph = fields[schema.name];
        
        if (Array.isArray(morph) && morph.length === 2) {
            transformed[schema.name] = [morph[0], transformer(morph[0], morph[1])];
        } else {
            transformed[schema.name] = morph;
        }
    }

    return transformed;
}

/**
 * Compile field
 */
function compile(
    schema: MorphToField,
    idMaker: IdMaker,
    fields: { [key: string]: any },
    forceCircularFallback: boolean = false
): { [key: string]: any } {
    const compiledFields = {};

    if (forceCircularFallback) {
        compiledFields[schema.idField] = { type: 'TASK_RAW_VALUE', value: schema.circularFallback };
        compiledFields[schema.typeField] = { type: 'TASK_RAW_VALUE', value: schema.typeCircularFallback };

        return compiledFields;
    }

    const morph = getValueWithFallback(schema, fields);

    if (typeof morph[1] === 'string' || typeof morph[1] === 'number') {
        compiledFields[schema.idField] = { type: 'TASK_ALIAS', alias: idMaker.getId(morph[0], morph[1]) };
        compiledFields[schema.typeField] = { type: 'TASK_RAW_VALUE', value: morph[0] };
    } else {
        compiledFields[schema.idField] = { type: 'TASK_RAW_VALUE', value: morph[1] };
        compiledFields[schema.typeField] = { type: 'TASK_RAW_VALUE', value: morph[0] };
    }

    return compiledFields;
}

exports.compile = compile;
exports.validate = validate;
exports.transform = transform;