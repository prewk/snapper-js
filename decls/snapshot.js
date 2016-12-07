declare type MapEntryDependency = {
    name: string;
    key: number | string;
    path: string;
    isInString: boolean;
    startPos: number;
    stopPos: number;
};

declare type EntityRow = {
    name: string;
    key: string | number;
    fields: { [key: string]: any };
};

declare type Snapshot = Array<EntityRow>;