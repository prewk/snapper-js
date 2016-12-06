// @flow

type EntityPair = [string, string | number];

/**
 * IdMaker
 */
function IdMaker(morphTable: { [key: string]: string }) {
    let nextId = 1;
    const books: { [key: string]: number } = {};
    const tuples: { [key: string]: EntityPair } = {};

    /**
     * Get/Create id with entity name and id
     */
    this.getId = (name: string, id: string | number): number => {
        if (morphTable.hasOwnProperty(name)) {
            name = morphTable[name];
        }

        const key = `${name}/${id}`;

        if (!books.hasOwnProperty(key)) {
            const madeId = nextId++;

            books[key] = madeId;
            tuples['' + madeId] = [name, id];
        }

        return books[key];
    };

    /**
     * Get entity pair by id
     */
    this.getEntity = (id: number): EntityPair => {
        if (!tuples.hasOwnProperty('' + id)) {
            throw new Error(`Tried to get (entity, id) tuple for an unknown internal id: ${id}`);
        }

        return tuples['' + id];
    };

    /**
     * Get books
     */
    this.getBooks = (): { [key: string]: number } => {
        return books;
    }
}

module.exports = IdMaker;