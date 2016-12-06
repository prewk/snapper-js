const getValueRelationDep = require('./value-relation-entry').getDependencies;
const getListRelationDeps = require('./list-relation-entry').getDependencies;
const getRegExpRelationDeps = require('./reg-exp-relation-entry').getDependencies;

function getMapEntryDependencies(relation, map, dotMap) {
    switch (relation.type) {
        case 'VALUE_RELATION_ENTRY':
            return getValueRelationDep(relation, map, dotMap);
        case 'LIST_RELATION_ENTRY':
            return getListRelationDeps(relation, map, dotMap);
        case 'REG_EXP_RELATION_ENTRY':
            return getRegExpRelationDeps(relation, map, dotMap);
        default:
            throw new Error(`Invalid relation entry type: ${ relation.type }`);
    }
}

module.exports = getMapEntryDependencies;