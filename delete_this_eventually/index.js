const ClauseObject = {
    whereClause: String,
    limit: Number,
    limitStart: Number,
    orderByClause: String
};


class Book {
    constructor() {
        this._table = 'BOOK';
        this.title = '';
        this.contents = '';
        /**
         *
         * @type {Date}
         */
        this.publishedDate = null;
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
        this._table = 'AUTHOR';

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



async function main() {

}