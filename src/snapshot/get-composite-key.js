// @flow

/**
 * Get composite key
 */
function getCompositeKey(row: EntityRow): string {
    return `${row.name}-${row.key}`;
}

module.exports = getCompositeKey;