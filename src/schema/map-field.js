// @flow

const uuidGen = require('uuid/v1');
const flattenDeep = require('lodash/flattenDeep');
const get = require('lodash/get');
const set = require('lodash/set');
const cloneDeep = require('lodash/cloneDeep');
const dot = require('dot-object');
const isPlainObject = require('lodash/isPlainObject');
const getCompositeKey = require('../snapshot/get-composite-key');
const getMapEntryDependencies = require('./get-map-entry-dependencies');
const adjustOffset = require('./adjust-offset');
const getValueWithFallback = require('./get-value-with-fallback');
const disassembleJson = require('./disassemble-json');
const IdMaker = require('../compiler/id-maker');

/**
 * Validate a Map field
 */
function validate(schema: MapField, fields: { [key: string]: any }, entities: Snapshot): Array<string> {
    const value = getValueWithFallback(schema, fields);
    const errors = [];

    if (Array.isArray(value) || isPlainObject(value)) {
        const dotMap = dot.dot(value);
        const keyLookup = entities.reduce((keyLookup: Object, entity: EntityRow) => {
            const assignee = {};
            assignee[getCompositeKey(entity)] = true;

            return Object.assign(keyLookup, assignee);
        }, {});
        
        // Gather all dependencies in this map
        const dependencies = flattenDeep(schema.relations.map((relation: MapEntry) =>
            getMapEntryDependencies(relation, value, dotMap))
        );
        
        dependencies.forEach((dependency) => {
            if (!keyLookup.hasOwnProperty(getCompositeKey(dependency))) {
                errors.push(`Couldn't find required relation for ${schema.name} in ${dependency.path}`);
            }
        });
    } else {
        return [`MapField ${schema.name} must be - or fallback to - an array or plain object`]
    }

    return errors;
}

/**
 * Transform a Map field
 */
function transform(
    schema: MapField,
    fields: { [key: string]: any },
    transformer: (name: string, id: string | number) => string | number
): { [key: string]: any } {
    const transformed = {};

    if (fields.hasOwnProperty(schema.name)) {
        const map = cloneDeep(fields[schema.name]);
        const dotMap = dot.dot(map);
        
        // Gather all dependencies in this map
        const deps = flattenDeep(schema.relations.map((relation: MapEntry) =>
            getMapEntryDependencies(relation, map, dotMap))
        );
        
        for (let i = 0; i < deps.length; i++) {
            const dependency: MapEntryDependency = deps[i];

            const replacement = transformer(dependency.name, dependency.key);

            if (dependency.isInString) {
                let target = get(map, dependency.path);
                if (typeof target !== 'string') {
                    throw new Error(`Tried to transform a map's string in ${schema.name} at path ${dependency.path}, found non-string`);
                }

                // foobar<123>baz -> foobar<__id__456>baz
                target = target.substring(0, dependency.startPos) + replacement + target.substring(dependency.stopPos);
                set(map, dependency.path, target);

                // Adjust offsets on remaining dependencies if needed
                const diff = ('' + replacement).length - ('' + dependency.key).length;

                // If offset needs to be adjusted and there are more dependencies after this one
                if (diff !== 0 && deps.length > i + 1) {
                    // Iterate through all in-string dependencies after this one (with the same path) and adjust their offset
                    for (let r = i + 1; r < deps.length; r++) {
                        if (deps[r].isInString && deps[r].path === deps[i].path) {
                            deps[r] = adjustOffset(deps[r], diff, dependency.startPos);
                        }
                    }
                }
            } else {
                set(map, dependency.path, replacement);
            }
        }

        transformed[schema.name] = map;
    }

    return transformed;
}

/**
 * Compile field
 */
function compile(
    schema: MapField,
    idMaker: IdMaker,
    fields: { [key: string]: any },
    forceCircularFallback: boolean = false
): { [key: string]: any } {
    if (forceCircularFallback) {
        const compiled = {};
        compiled[schema.name] = { type: 'TASK_RAW_VALUE', value: schema.circularFallback };
        
        return compiled;
    }

    const hashToUuid = {};
    const uuidToTaskId = {};

    const transformed = transform(schema, fields, (name, id) => {
        const hash = btoa(`${name}/${id}`);
        
        if (!hashToUuid.hasOwnProperty(hash)) {
            hashToUuid[hash] = uuidGen();
            uuidToTaskId[hashToUuid[hash]] = idMaker.getId(name, id);
        }
        
        return hashToUuid[hash];
    });
    
    switch (schema.cast) {
        case 'JSON':
            const disassembled = disassembleJson(transformed, Object.keys(hashToUuid).map((key) => hashToUuid[key]));
            
            const compiledFields = {};
            compiledFields[schema.name] = {
                type: 'TASK_ASSEMBLED_ALIAS',
                parts: disassembled.map((part) => {
                    const [type, cast, value] = part;
                    
                    if (type === 'ALIAS' && uuidToTaskId.hasOwnProperty(value)) {
                        return [type, cast, uuidToTaskId[value]];
                    }
                    
                    return part;
                }),
            };
            
            return compiledFields;
        default:
            throw new Error(`Unsupported MapField cast while compiling: ${schema.cast}`);
    }
}

exports.compile = compile;
exports.validate = validate;
exports.transform = transform;