const validate = require('../map-field').validate;
const transform = require('../map-field').transform;

describe('MapField', () => {
    it('should validate', () => {
        expect(validate({
            name: 'data',
            optional: false,
            relations: [
                {
                    type: 'VALUE_RELATION_ENTRY',
                    path: 'a',
                    relation: 'bars',
                },
                {
                    type: 'VALUE_RELATION_ENTRY',
                    path: 'b',
                    relation: 'bazs',
                },
            ]
        }, {
            data: { a: 456, b: 789 }
        }, [
            {
                name: 'foos',
                key: 123,
                fields: { data: { a: 456, b: 789 } },
            },
            {
                name: 'bars',
                key: 456,
                fields: {},
            },
            {
                name: 'bazs',
                key: 789,
                fields: {},
            }
        ])).toHaveLength(0);
    });

    it('should transform', () => {
        expect(transform({
            name: 'data',
            optional: false,
            relations: [
                {
                    type: 'VALUE_RELATION_ENTRY',
                    path: 'a',
                    relation: 'bars',
                },
                {
                    type: 'VALUE_RELATION_ENTRY',
                    path: 'b',
                    relation: 'bazs',
                },
                {
                    type: 'LIST_RELATION_ENTRY',
                    path: 'c.d',
                    relation: 'quxs',
                },
                {
                    type: 'REG_EXP_RELATION_ENTRY',
                    path: 'c.e',
                    matchers: [
                        {
                            type: 'REG_EXP_RELATION_MATCHER',
                            expression: '/id:(\\d+)/',
                            cast: 'AUTO',
                            relations: [null, 'texts'],
                        }
                    ],
                },
                {
                    type: 'REG_EXP_RELATION_ENTRY',
                    path: 'c.f',
                    matchers: [
                        {
                            type: 'REG_EXP_RELATION_MATCHER',
                            expression: '/href=\"#\\/bars\\/([^\"]*)\"/',
                            cast: 'AUTO',
                            relations: [null, 'bars'],
                        },
                        {
                            type: 'REG_EXP_RELATION_MATCHER',
                            expression: '/href=\"#\\/bazs\\/([^\"]*)\"/',
                            cast: 'AUTO',
                            relations: [null, 'bazs'],
                        },
                    ],
                },
            ]
        }, {
            data: {
                a: 456,
                b: 789,
                c: {
                    d: [100, 200],
                    e: 'Lorem id:123 Ipsum id:234',
                    f: '<p><a href="#/bars/456">Bars 456</a>, <a href="#/bazs/789">Bazs 789</a><p>'
                }
            }
        }, (name, id) =>
            btoa(`${name}/${id}`)
        )).toEqual({
            data: {
                a: btoa(`bars/456`),
                b: btoa(`bazs/789`),
                c: {
                    d: [btoa(`quxs/100`), btoa(`quxs/200`)],
                    e: `Lorem id:${btoa('texts/123')} Ipsum id:${btoa('texts/234')}`,
                    f: `<p><a href="#/bars/${btoa('bars/456')}">Bars 456</a>, <a href="#/bazs/${btoa('bazs/789')}">Bazs 789</a><p>`,
                },
            },
        })
    });
});