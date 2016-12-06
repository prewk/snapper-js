describe('Validator', () => {
    it('should validate a complex snapshot', () => {
        const snapshot = require('snapper-schema/resources/snapshots/large.json');
        const schema = require('snapper-schema/resources/schemas/large.json');

        const validator = require('../src/validator-factory')();

        expect(validator.validate(schema, snapshot)).toHaveLength(0);
    });

    it('should transform a complex snapshot', () => {
        const snapshot = require('snapper-schema/resources/snapshots/large.json');
        const schema = require('snapper-schema/resources/schemas/large.json');
        const transformed = require('snapper-schema/resources/transformed/large.json');

        const transformer = require('../src/transformer-factory')();

        expect(transformer.transform(schema, snapshot, (name, id) =>
            btoa(`${name}/${id}`)
        )).toEqual(transformed);
    });

    it('should compile a complex snapshot', () => {
        const snapshot = require('snapper-schema/resources/transformed/large.json');
        const schema = require('snapper-schema/resources/schemas/large.json');
        const compiled = require('snapper-schema/resources/compiled/large.json');

        const compiler = require('../src/compiler-factory')();

        expect(compiler.compile(schema, snapshot)).toEqual(compiled);
    });
});