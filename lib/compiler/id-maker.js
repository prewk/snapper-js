

/**
 * IdMaker
 */
function IdMaker(morphTable) {
    let nextId = 1;
    const books = {};
    const tuples = {};

    /**
     * Get/Create id with entity name and id
     */
    this.getId = (name, id) => {
        if (morphTable.hasOwnProperty(name)) {
            name = morphTable[name];
        }

        const key = `${ name }/${ id }`;

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
    this.getEntity = id => {
        if (!tuples.hasOwnProperty('' + id)) {
            throw new Error(`Tried to get (entity, id) tuple for an unknown internal id: ${ id }`);
        }

        return tuples['' + id];
    };

    /**
     * Get books
     */
    this.getBooks = () => {
        return books;
    };
}

module.exports = IdMaker;