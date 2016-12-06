

/**
 * Find Entity in Schema by name
 */
function getEntityByName(schema, name) {
    const candidate = schema.find(entity => entity.name === name);

    if (!candidate) throw new Error(`Schema doesn't have an entity named: ${ name }`);

    return candidate;
}

module.exports = getEntityByName;