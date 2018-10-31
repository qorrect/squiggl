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

class AuthorDAO {

    constructor(table = 'Author') {
        this._table = table;
    }

    async findById(id) {
        let sql = `SELECT * from ${this._table} WHERE id=${id}`;
        console.log(sql);
        const res = await db.query(sql);
        return AuthorDAO.rowToClass(res[0][0])
    }

    static get() {
        if (authorInstance) return authorInstance;
        else {
            authorInstance = new AuthorDAO();
            return authorInstance;
        }
    }

    static rowToClass(row) {
        const author = new Author(row.name, row.age, row.id);
        return author;
    }


}

class Author {


    constructor(name = null, age = null, id = null) {
        this._table = 'Author';

        this.name = name;
        this.age = age;
        this.id = id;
    }

}


async function main() {

    const author = await AuthorDAO.get().findById(1);
    console.log(JSON.stringify(author, null, 4));


}

main().then(() => process.exit());