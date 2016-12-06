const IdResolver = require('./compiler/id-resolver');
const IdMaker = require('./compiler/id-maker');
const getMorphTable = require('./schema/get-morph-table');

/**
 * Compiler factory
 */
function make() {
    return {
        compile: (schema, entities) => require('./compiler/compile')(new IdMaker(getMorphTable(schema)), new IdResolver(), schema, entities)
    };
}

module.exports = make;