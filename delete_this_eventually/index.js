const ClauseObject = {
    whereClause: String,
    limit: Number,
    limitStart: Number,
    orderByClause: String
};

class Book {
    constructor() {
        this.title = '';
        this.contents = '';
        /**
         *
         * @type {Author}
         */
        this.author = null;
    }

    getAuthor() {

    }
}

class Author {


    constructor() {
        this.name = '';
        this.age = 0;
    }

    static findById(id) {

    }

    /**
     *
     * @param {ClauseObject} clauseObject - clauses and shit
     */

    static find(clauseObject) {

    }

    /**
     * @returns {Book}
     */
    getBooks() {

    }
}