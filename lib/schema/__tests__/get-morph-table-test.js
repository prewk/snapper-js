const getMorphTable = require('../get-morph-table');

describe('getMorphTable', () => {
    it('should extract all morphTo properties from a schema of entities', () => {
        expect(getMorphTable([{ name: 'foos', morphAs: 'Foo' }, { name: 'bars', morphAs: 'Bar' }, { name: 'bazs', morphAs: 'Baz' }])).toEqual({
            Foo: 'foos',
            Bar: 'bars',
            Baz: 'bazs'
        });
    });
});