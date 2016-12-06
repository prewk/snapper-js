

/**
 * Get composite key
 */
function getCompositeKey(row) {
  return `${ row.name }-${ row.key }`;
}

module.exports = getCompositeKey;