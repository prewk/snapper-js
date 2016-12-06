

/**
 * Perform the match and return the correct case
 */
function resolve(schema, fields) {
    let value = null;

    if (!fields.hasOwnProperty(schema.name)) {
        if (schema.optional) {
            value = schema.fallback;
        } else {
            throw new Error(`Required field missing for MatchField: ${ schema.name }`);
        }
    } else {
        value = fields[schema.name];
    }

    const candidate = schema.cases.find(_case => {
        const [match] = _case;

        if (match === value) {
            return true;
        }

        return false;
    });

    if (candidate) {
        return candidate[1];
    }

    return schema.default;
}

/**
 * Validate a match field
 */
function validate(schema, fields, entities, validateField) {
    const field = resolve(schema, fields);

    return validateField(field, fields, entities);
}

/**
 * Transform a MatchField
 */
function transform(schema, fields, transformer, transformField) {
    if (fields.hasOwnProperty(schema.name)) {
        return transformField(resolve(schema, fields), fields, transformer);
    } else {
        return {};
    }
}

/**
 * Compile field
 */
function compile(schema, idMaker, fields, forceCircularFallback = false, compileField) {
    const field = resolve(schema, fields);

    if (forceCircularFallback) {
        const compiledFields = {};
        compiledFields[field.name] = { type: 'TASK_RAW_VALUE', value: field.circularFallback };

        return compiledFields;
    }

    return compileField(field, idMaker, fields, forceCircularFallback);
}

exports.compile = compile;
exports.validate = validate;
exports.transform = transform;