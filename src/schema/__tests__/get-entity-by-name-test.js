const getEntityByName = require('../get-entity-by-name');

describe('getEntityByName', () => {
    it('should get entity by name', () => {
        const entity1 = {
            name: 'foos',
        };

        const entity2 = {
            name: 'bars',
        };

        expect(getEntityByName([
            entity1,
            entity2,
        ], 'bars')).toBe(entity2);
    });

    it('should throw if missing entity', () => {
        expect(() => {
            getEntityByName([], 'missing');
        }).toThrow();
    });
});