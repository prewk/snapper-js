// @flow

/**
 * Gets a value with fallback, crashes if unresolvable
 */
function getValueWithFallback(schema: Field, fields: { [key: string]: any }): any {
    if (!fields.hasOwnProperty(schema.name) && !schema.optional) {
        return [`Non-optional field ${schema.name} missing its value`];
    }

    return fields.hasOwnProperty(schema.name) ? fields[schema.name] : schema.fallback;
}

module.exports = getValueWithFallback;