declare interface Transformer {
    transform(
        schema: Schema,
        snapshot: Snapshot,
        transformer: (name: string, id: string | number) => string | number
    ): Snapshot
};