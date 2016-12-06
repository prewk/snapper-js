// @flow

/**
 * Get morph table for a schema
 */
function getMorphTable(schema: Schema): { [key: string]: string } {
    return schema.reduce((morphTable: { [key: string]: string }, entity: Entity) => {
        if (!morphTable.hasOwnProperty(entity.morphAs)) {
            morphTable[entity.morphAs] = entity.name;
        }
        
        return morphTable;
    }, {});
}

module.exports = getMorphTable;