declare type ValueField = {
    type: 'VALUE';
    cast: 'NONE' | 'JSON' | 'INTEGER' | 'FLOAT';
    name: string;
    optional: boolean;
    fallback: any;
    circularFallback: any;
}

declare type BelongsToField = {
    type: 'BELONGS_TO';
    foreignEntity: string;
    localKey: string;
    name: string;
    optional: boolean;
    fallback: any;
    circularFallback: any;
}

declare type ValueRelationEntry = {
    type: 'VALUE_RELATION_ENTRY';
    path: string;
    relation: string;
}

declare type ListRelationEntry = {
    type: 'LIST_RELATION_ENTRY';
    path: string;
    relation: string;
}

declare type RegExpRelationMatcher = {
    type: 'REG_EXP_RELATION_MATCHER';
    expression: string;
    cast: 'NONE' | 'INTEGER' | 'STRING' | 'AUTO';
    relations: Array<string | number>;
};

declare type RegExpRelationEntry = {
    type: 'REG_EXP_RELATION_ENTRY';
    path: string;
    matchers: Array<RegExpRelationMatcher>;
}

declare type MapEntry = ValueRelationEntry | ListRelationEntry | RegExpRelationEntry;

declare type MapField = {
    type: 'MAP';
    cast: 'JSON';
    greedy: boolean;
    relations: Array<MapEntry>;
    name: string;
    optional: boolean;
    fallback: any;
    circularFallback: any;
}

declare type MorphToField = {
    type: 'MORPH_TO';
    idField: string;
    typeField: string;
    name: string;
    optional: boolean;
    fallback: any;
    circularFallback: any;
    typeCircularFallback: any;
};

declare type MatchField = {
    type: 'MATCH';
    default: Field;
    cases: Array<[any, Field]>;
    name: string;
    optional: boolean;
    fallback: any;
    circularFallback: any;
};

declare type Field = ValueField | BelongsToField | MapField | MorphToField | MatchField;

declare type PrimaryKeyField = {
    type: 'PRIMARY_KEY';
    name: string;
}

declare type EntityKey = PrimaryKeyField;

declare type Entity = {
    type: 'ENTITY';
    name: string;
    key: EntityKey;
    fields: Array<Field>,
    morphAs: string;
}

declare type Schema = Array<Entity>;