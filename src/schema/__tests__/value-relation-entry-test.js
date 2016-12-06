const getDependencies = require('../value-relation-entry').getDependencies;

describe('ValueRelationEntry', () => {
    it('should get dependencies', () => {
        expect(getDependencies(
            { path: 'foo_id', relation: 'foos' },
            { foo_id: 123 },
            { foo_id: 123 }
        )).toEqual([
            { name: 'foos', key: 123, path: 'foo_id', isInString: false, startPos: 0, stopPos: 0 }
        ]);
    });

    it('should not get missing dependencies', () => {
        expect(getDependencies(
            { path: 'foo_id', relation: 'foos' },
            {},
            {}
        )).toEqual([]);
    });
});