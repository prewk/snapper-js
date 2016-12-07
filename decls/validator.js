declare interface Validator {
    validate(schema: Schema, snapshot: Snapshot): Array<string>
};