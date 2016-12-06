// @flow

const sortBy = require('lodash/sortBy');

type ListenerPair = [Array<number>, () => void];

function IdResolver() {
    const listeners: { [key: string]: ListenerPair | null } = {};
    const resolved: Array<number> = [];

    /**
     * Has listener?
     */
    this.hasListener = (id: number): boolean => {
        return listeners.hasOwnProperty('' + id) && listeners['' + id] !== null;
    };

    /**
     * Find circular dependencies
     */
    this.findCircularDeps = (id: number, dependencies: Array<number>): Array<number> => {
        return dependencies.filter((dependency) =>
            this.hasListener(dependency) &&
            listeners['' + dependency][0].includes(id)
        );
    };

    /**
     * Fire and forget all handlers with resolved dependencies
     */
    this.resolve = (): void => {
        const ids = [];

        Object.keys(listeners).forEach((id) => {
            const tuple = listeners['' + id];
            if (tuple === null) return;

            const [deps] = tuple;

            const resolvable = deps.reduce((resolvable, dep) =>
                resolvable && resolved.includes(dep)
            , true);

            if (resolvable) {
                ids.push(id);
            }
        });

        // Sort for more reliable determinism
        sortBy(ids).forEach((id) => {
            // Due to recursion some earlier handler in this forEach might nullify stuff before this iteration starts
            if (listeners['' + id] === null) return;

            const handler = listeners['' + id][1];

            listeners['' + id] = null;

            handler();
        });
    };

    /**
     * Report an id as resolved
     */
    this.report = (id: number): void => {
        if (resolved.includes(id)) {
            throw new Error(`Can't report id ${id}, it's already reported`);
        }

        resolved.push(id);
        
        this.resolve();
    };

    /**
     * Unregister an id
     */
    this.unregister = (id: number): void => {
        if (listeners.hasOwnProperty('' + id)) {
            throw new Error(`Can't unregister listener because id didn't exist for id ${id}`);
        } else if (listeners['' + id] === null) {
            throw new Error(`Can only unregister a listener for id ${id} once`);
        }

        listeners['' + id] = null;
    };

    /**
     * Listen and run handler when dependencies have been resolved
     */
    this.listen = (id: number, dependencies: Array<number>, handler: () => void): () => void => {
        if (this.hasListener(id)) {
            throw new Error(`Tried to register two listeners for the same id: ${id}`);
        } else if (this.findCircularDeps(id, dependencies).length) {
            throw new Error(`Making ${id} rely on ${dependencies.join(', ')} would cause a circular dependency`);
        }

        listeners['' + id] = [dependencies, handler];

        this.resolve();

        return this.unregister.bind(this, id);
    };
}

module.exports = IdResolver;