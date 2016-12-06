// @flow

/**
 * Get field name, given a column name, using a name-to-column map
 */
function getFieldName(nameToColumnMap: { [key: string]: Array<string> }, column: string): string {
    for (let name in nameToColumnMap) {
        if (nameToColumnMap.hasOwnProperty(name)) {
            const columns = nameToColumnMap[name];
            
            if (columns.includes(column)) {
                return name;
            }
        }
    }
    
    throw new Error(`Couldn't find the field name for a column '${column}'`);
}

module.exports = getFieldName;