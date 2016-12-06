const hasEntity = require('../has-entity');

describe('hasEntity', () => {
    it('should determine whether the requested entity exists', () => {
        expect(hasEntity([{ name: 'foos', key: 123 }]), 'foos', 123).toBeTrue;
        expect(hasEntity([{ name: 'foos', key: 123 }]), 'foos', 456).toBeFalse;
    });
});