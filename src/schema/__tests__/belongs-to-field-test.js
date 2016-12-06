const validate = require('../belongs-to-field').validate;

describe('BelongsToField', () => {
    it('should validate', () => {
        expect(validate({
            name: 'bar',
            foreignEntity: 'bars',
        }, {
            bar: 123,
        }, [
            { name: 'bars', key: 123 }
        ])).toHaveLength(0);
    });
});