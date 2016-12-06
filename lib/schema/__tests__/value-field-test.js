const validate = require('../value-field').validate;

describe('ValueField', () => {
    it('should validate', () => {
        expect(validate({
            cast: 'NONE',
            name: 'foo'
        }, {
            foo: 'bar'
        })).toHaveLength(0);
    });
});