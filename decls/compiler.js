declare type TaskRawValue = {
    type: 'TASK_RAW_VALUE';
    value: any;
}

declare type TaskAlias = {
    type: 'TASK_ALIAS';
    alias: number;
}

declare type TaskAssembledAliasPart = ['PART' | 'ALIAS', 'NONE' | 'JSON', string | number];

declare type TaskAssembledAlias = {
    type: 'TASK_ASSEMBLED_ALIAS';
    parts: Array<TaskAssembledAliasPart>
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

declare type EntityPair = [string, string | number];