const getDependencies = require('../list-relation-entry').getDependencies;

describe('ListRelationEntry', () => {
    it('should get dependencies', () => {
        expect(getDependencies({ path: 'foos', relation: 'foos' }, { foos: [123, 456] }, {
            'foos.0': 123,
            'foos.1': 456
        })).toEqual([{ name: 'foos', key: 123, path: 'foos.0', isInString: false, startPos: 0, stopPos: 0 }, { name: 'foos', key: 456, path: 'foos.1', isInString: false, startPos: 0, stopPos: 0 }]);
    });

    it('should not get missing dependencies', () => {
        expect(getDependencies({ path: 'foos', relation: 'foos' }, { foos: [null] }, { 'foos.0': null })).toHaveLength(0);
    });
});