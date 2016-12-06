

/**
 * Does this snapshot have the given entity?
 */
function hasEntity(entities, name, key) {
  return !!entities.find(entityRow => entityRow.name === name && entityRow.key === key);
}

module.exports = hasEntity;