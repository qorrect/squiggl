var db = require('mysql-promise')();

db.configure({
    "host": "localhost",
    "user": "root",
    "password": "m",
    "database": "TEST"
});

const ClauseObject = {
    whereClause: String,
    limit: Number,
    limitStart: Number,
    orderByClause: String
};


class Book {
    constructor(title, contents, publishedDate, id) {
        this._table = 'BOOK';
        this.title = title;
        this.contents = contents;
        /**
         *
         * @type {Date}
         */
        this.publishedDate = publishedDate;
        /**
         *
         * @type {Author}
         */
        this.author = null;
        this.id = id;
    }

}

let authorInstance = null;
let bookInstance = null;

class SquigglDAO {

    constructor(table) {
        this._table = table;
    }

    getTable() {
        return this._table;
    }

    async findById(id) {
        let sql = `SELECT * from ${this._table} WHERE id=${id}`;
        console.log(sql);
        const res = await db.query(sql);
        console.log(JSON.stringify(res[0][0], null, 4));
        return this.rowToClass(res[0][0])
    }

    async rowToClass() {
        throw new Error('This must be overriden');
    }

}

class BookDAO extends SquigglDAO {

    constructor(table = 'Book') {
        super(table);
    }

    static get() {
        if (bookInstance) return bookInstance;
        else {
            bookInstance = new BookDAO();
            return bookInstance;
        }
    }
}

class AuthorDAO extends SquigglDAO {

    constructor(table = 'Author') {
        super(table);
    }


    static get() {
        if (authorInstance) return authorInstance;
        else {
            authorInstance = new AuthorDAO();
            return authorInstance;
        }
    }

    /**
     * @override
     * @param row
     * @return {Promise<Author>}
     */
    async rowToClass(row) {
        const author = new Author(row.name, row.age, row.id);
        console.log(JSON.stringify(author, null, 4));
        return author;

    }


}

class Author {


    constructor(name = null, age = null, id = null) {
        this._table = 'Author';
        this.name = name;
        this.age = age;
        this.id = id;

        this.books = [];

    }

}


async function main() {

    const author = await AuthorDAO.get().findById(1);
    console.log(JSON.stringify(author, null, 4));


}

main().then(() => process.exit());