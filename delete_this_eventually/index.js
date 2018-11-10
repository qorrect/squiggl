const Connection = require('database-js').Connection;
const {clone} = require('../src/utils/sysUtils');
const ClauseObject = {
    whereClause: String,
    limit: Number,
    limitStart: Number,
    orderByClause: String
};


class SquiggBean {

    constructor(row) {
        Object.keys(row).forEach(key => this[key] = row[key]);
    }
}


class Author extends SquiggBean {

    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Author(row);
    }

}


class Book extends SquiggBean {

    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Book(row);
    }


}

let authorInstance = null;
let bookInstance = null;

class SquiggDao {

    constructor(table, clz) {

        this.clz = clz;
        this.connection =
            // new Connection("sqlite:///path/to/test.sqlite"); // SQLite
            new Connection("mysql://root:m@localhost/CHARLIE_TEST"); // MySQL
// new Connection("postgres://user:password@localhost/test"); // PostgreSQL
        this._table = table;
    }

    getTable() {
        return this._table;
    }

    async _exec(sql, ...args) {
        console.log(`Executing ${sql} with (${args})`);

        const statement = this.connection.prepareStatement(sql);
        const results = await statement.query(args);
        // console.log(results);
        return results;
    }

    async _findById(id) {
        const sql = `SELECT * from ${this._table} WHERE id = ? `;
        const res = await this._exec(sql, id);
        return this.rowToClass(res[0])
    }

    async nToOneRelated(id, column) {
        const sql = `SELECT * from ${this._table} WHERE ${column}_id = ?`;
        const res = await this._exec(sql, id);
        return res;
    }

    getRelatedFields() {
        return [];
    }

    /**
     * @override
     * @param row
     * @return {Promise<Author>}
     */
    async rowToClass(row) {
        if (row) {
            console.log(this.clz);
            const author = this.clz.create(row);
            const fields = this.getRelatedFields();

            for (let i = 0; i < fields.length; i++) {
                const obj = fields[i];
                const res = await obj['dao'].get()['nToOneRelated'](row.id, this.getTable());
                author[obj['field']] = await obj['dao'].get()['rowToClass'](res);
            }


            return author;
        }
        else return new Author();

    }

    async _update(bean) {
        throw new Error('This must be overriden');
    }

    async _insert(bean) {
        throw new Error('This must be overriden');
    }

    async upsert(bean) {
        if (bean.id) return _update(bean);
        else return _insert(bean);
    }

}

class BookDAO extends SquiggDao {

    constructor(table = 'Book', clz = Book) {
        super(table, clz);
    }

    static get() {
        if (bookInstance) return bookInstance;
        else {
            bookInstance = new BookDAO();
            return bookInstance;
        }
    }

}

class AuthorDAO extends SquiggDao {

    constructor(table = 'Author', clz = Author) {
        super(table, clz);
    }

    getRelatedFields() {
        return [{
            field: 'books',
            table: 'Book',
            dao: BookDAO,
            relation: 'nToOneRelated'
        }];
    }

    static findById(id) {
        return AuthorDAO.get()._findById(id);
    }

    static get() {
        if (authorInstance) return authorInstance;
        else {
            authorInstance = new AuthorDAO();
            return authorInstance;
        }
    }


}

async function main() {

    const author = await AuthorDAO.findById(1);
    console.log(JSON.stringify(author, null, 4));


}

main().then(() => process.exit());