// @flow

/**
 * Does this snapshot have the given entity?
 */
function hasEntity(entities: Snapshot, name: string, key: any): boolean {
    return !!entities.find((entityRow: EntityRow) => entityRow.name === name && entityRow.key === key);
}

module.exports = hasEntity;