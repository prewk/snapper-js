// @flow

const IdResolver = require('./compiler/id-resolver');
const IdMaker = require('./compiler/id-maker');
const getMorphTable = require('./schema/get-morph-table');

/**
 * Compiler factory
 */
function make(): Compiler {
    return {
        compile: (schema: Schema, entities: Snapshot): TaskSequence =>
            require('./compiler/compile')(
                new IdMaker(getMorphTable(schema)),
                new IdResolver(),
                schema,
                entities
            ),
    };
}

module.exports = make;