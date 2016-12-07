declare type TaskRawValue = {
    type: 'TASK_RAW_VALUE';
    value: any;
}

declare type TaskAlias = {
    type: 'TASK_ALIAS';
    alias: number;
}

declare type TaskAssembledAliasPart = ['PART', 'NONE', string];

declare type TaskAssemledAliasAlias = ['ALIAS', 'NONE' | 'JSON', number];

declare type TaskAssembledAlias = {
    type: 'TASK_ASSEMBLED_ALIAS';
    parts: Array<TaskAssembledAliasPart | TaskAssemledAliasAlias>
}

declare type TaskValue = TaskRawValue | TaskAlias | TaskAssembledAlias;

declare type CreateTask = {
    type: 'CREATE_TASK';
    entity: string;
    alias: number;
    columns: Array<string>;
    values: Array<TaskValue>;
}

declare type UpdateTask = {
    type: 'UPDATE_TASK';
    entity: string;
    alias: number;
    keyName: string;
    columns: Array<string>;
    values: Array<TaskValue>;
}

declare type Task = CreateTask | UpdateTask;

declare type TaskSequence = Array<Task>;

declare interface Compiler {
    compile(
        schema: Schema,
        snapshot: Snapshot
    ): TaskSequence;
}

declare interface IdMaker {
    getId(name: string, id: string | number): number;
    getEntity(id: number): EntityPair;
    getBooks(): { [key: string]: number };
}

declare interface IdResolver {
    hasListener(id: number): boolean;
    findCircularDeps(id: number, dependencies: Array<number>): Array<number>;
    resolve(): void;
    report(id: number): void;
    unregister(id: number): void;
    listen(id: number, dependencies: Array<number>, handler: () => void): () => void;
};