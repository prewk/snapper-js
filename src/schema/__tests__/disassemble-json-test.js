const disassembleJson = require('../disassemble-json');

describe('disassembleJson', () => {
    it('should disassemble ints', () => {
        const full = {
            foo: 100,
            bars: [200, 300],
            a: {
                b: {
                    c: 'Lorem ipsum (id:400) dolor a(id:200)met',
                },
            },
        };

        const tokens = [
            100,
            200,
            300,
            400,
        ];

        const expected = [
            ['PART', 'NONE', "{\"foo\":"],
            ['ALIAS', 'JSON', 100],
            ['PART', 'NONE', ",\"bars\":["],
            ['ALIAS', 'JSON', 200],
            ['PART', 'NONE', ","],
            ['ALIAS', 'JSON', 300],
            ['PART', 'NONE', "],\"a\":{\"b\":{\"c\":\"Lorem ipsum (id:"],
            ['ALIAS', 'JSON', 400],
            ['PART', 'NONE', ") dolor a(id:"],
            ['ALIAS', 'JSON', 200],
            ['PART', 'NONE', ")met\"}}}"],
        ];

        expect(disassembleJson(full, tokens)).toEqual(expected);
    });

    it('should encode slashes correctly', () => {
        const full = {
            'text': '<a href="#100">test</a>',
        };

        const tokens = [
            100,
        ];

        const expected = [
            ['PART', 'NONE', "{\"text\":\"<a href=\\\"#"],
            ['ALIAS', 'JSON', 100],
            ['PART', 'NONE', "\\\">test</a>\"}"],
        ];

        expect(disassembleJson(full, tokens)).toEqual(expected);
    });

    it('should disassemble strings without quotation marks', () => {
        const full = {
            foo: 'abc',
            bars: ['def', 'ghi'],
            a: {
                b: {
                    c: 'Lorem ipsum (id:jkl) dolor a(id:def)met',
                },
            },
        };

        const tokens = [
            'abc',
            'def',
            'ghi',
            'jkl',
        ];

        const expected = [
            ['PART', 'NONE', "{\"foo\":"],
            ['ALIAS', 'JSON', "abc"],
            ['PART', 'NONE', ",\"bars\":["],
            ['ALIAS', 'JSON', "def"],
            ['PART', 'NONE', ","],
            ['ALIAS', 'JSON', "ghi"],
            ['PART', 'NONE', "],\"a\":{\"b\":{\"c\":\"Lorem ipsum (id:"],
            ['ALIAS', 'NONE', "jkl"],
            ['PART', 'NONE', ") dolor a(id:"],
            ['ALIAS', 'NONE', "def"],
            ['PART', 'NONE', ")met\"}}}"],
        ];

        expect(disassembleJson(full, tokens)).toEqual(expected);
    });
});