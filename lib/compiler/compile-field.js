const compileValue = require('../schema/value-field').compile;
const compileBelongsTo = require('../schema/belongs-to-field').compile;
const compileMap = require('../schema/map-field').compile;
const compileMorphTo = require('../schema/morph-to-field').compile;
const compileMatch = require('../schema/match-field').compile;
const IdMaker = require('./id-maker');

/**
 * Compile the field
 */
function compileField(schema, idMaker, fields, forceCircularFallback = false) {
    switch (schema.type) {
        case 'VALUE':
            return compileValue(schema, idMaker, fields, forceCircularFallback);
        case 'BELONGS_TO':
            return compileBelongsTo(schema, idMaker, fields, forceCircularFallback);
        case 'MAP':
            return compileMap(schema, idMaker, fields, forceCircularFallback);
        case 'MORPH_TO':
            return compileMorphTo(schema, idMaker, fields, forceCircularFallback);
        case 'MATCH':
            return compileMatch(schema, idMaker, fields, forceCircularFallback, compileField);
        default:
            throw new Error(`Invalid field type: ${ schema.type }`);
    }
}

module.exports = compileField;