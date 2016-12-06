const sortByMostRequired = require('../sort-by-most-required');
const IdMaker = require('../../id-maker');
const schema = require('snapper-schema/resources/schemas/large.json');
const transformed = require('snapper-schema/resources/transformed/large.json');
const makeCreateTask = require('../../make-create-task');
const expected = require('./sorted.json');
const getEntityByName = require('../../../schema/get-entity-by-name');

describe('sortByMostRequired', () => {
    it('should sort by most required task', () => {
        const idMaker = new IdMaker({});

        expect(sortByMostRequired(idMaker, transformed, transformed.map(entityRow => makeCreateTask(idMaker, getEntityByName(schema, entityRow.name), entityRow)[0]))).toEqual(expected);
    });
});