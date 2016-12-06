

/**
 * Get morph table for a schema
 */
function getMorphTable(schema) {
    return schema.reduce((morphTable, entity) => {
        if (!morphTable.hasOwnProperty(entity.morphAs)) {
            morphTable[entity.morphAs] = entity.name;
        }

        return morphTable;
    }, {});
}

module.exports = getMorphTable;