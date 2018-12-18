const Connection = require('database-js').Connection;

class SquigDao {

    constructor(table, clz) {

        this.clz = clz;
        this.connection =
            // new Connection("sqlite:///path/to/test.sqlite"); // SQLite
            new Connection('database-js-postgres://postgres:m@localhost/squig_test'); // MySQL
// new Connection("postgres://user:password@localhost/test"); // PostgreSQL
        this._table = table;
    }

    async init () {
        return this.createIfNotExists();
    }
    async createIfNotExists() {

        const splits = `CREATE TABLE IF NOT EXISTS Author (name varchar,age integer  ,  id SERIAL PRIMARY KEY  );
CREATE TABLE IF NOT EXISTS Book (title varchar,contents text,publishDate Date,Author_id int ,  id SERIAL PRIMARY KEY  );
CREATE TABLE IF NOT EXISTS Editor (name varchar,yearEstablished integer  ,  id SERIAL PRIMARY KEY  );
CREATE TABLE IF NOT EXISTS Editor_Book (Editor_id int, Book_id int,   id SERIAL PRIMARY KEY  );
CREATE TABLE IF NOT EXISTS Fans (title varchar,Author_id int , FOREIGN KEY (Author_id) REFERENCES Author (id), id SERIAL PRIMARY KEY  );
`.split(';');
        const results = [];
        for (let i = 0; i < splits.length; i++) {
            const sql = splits[i];
            const res = await this._execute(sql);
            results.push(res);
        }
        return results;

    }

    getTable() {
        return this._table;
    }


    async _execute(sql) {
        console.log(`Executing ${sql})`);
        const statement = this.connection.prepareStatement(sql);
        const results = await statement.execute();
        // console.log(results);
        return results;
    }


    async _exec(sql, ...args) {
        console.log(`Executing ${sql} with (${args})`);
        const statement = this.connection.prepareStatement(sql);
        const results = await statement.query(...args);
        // console.log(results);
        return results;
    }


    async _find(sql, ...args) {
        const res = await this._exec(`SELECT * from ${this._table} WHERE ` + sql, ...args);
        const ret = await this.rowToClass(res);
        return ret;
    }

    async _insert(bean) {

        const fields = Object.keys(bean);
        const values = Object.keys(bean).map(() => ' ? ');
        const args = Object.keys(bean).map(key => bean[key]);

        const sql = `INSERT INTO ${this._table} (${fields}) VALUES(${values})`;
        return this._exec(sql, ...args);
    }

    async _findById(id) {
        const sql = `SELECT * from ${this._table} WHERE id = ? `;
        const res = await this._exec(sql, id);
        return this.rowToClass(res[0]);
    }

    async nToOneRelated(id, column) {
        const sql = `SELECT * from ${this._table} WHERE ${column}_id = ?`;
        const res = await this._exec(sql, id);
        return res;
    }

    async nToOneReferenced(id, column) {
        const sql = `SELECT * from ${column} WHERE ${this._table}_id = ?`;
        const res = await this._exec(sql, id);
        return res;
    }

    async oneToNRelated(id, column) {
        const sql = `SELECT * from ${column} WHERE id = ?`;
        const res = await this._exec(sql, id);
        return res;
    }

    async oneToNReferenced(id, column) {
        const sql = `SELECT * from ${column} WHERE id = ?`;
        const res = await this._exec(sql, id);
        return res;
    }

    async nToNRelated(id, column) {
        const sql = `SELECT * from ${this._table} WHERE id in (
                        SELECT ${this._table}_id from ${this._table}_${column} WHERE ${column}_id = ?
                    )`;
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
        if (Array.isArray(row)) {
            const res = [];
            for (let i = 0; i < row.length; i++) {
                res.push(await this._rowToClass(row[i]));
            }
            return res;
        } else return this._rowToClass(row);
    }

    async _rowToClass(row) {
        if (row) {
            const retObj = this.clz.create(row);
            const fields = this.getRelatedFields();
            for (let i = 0; i < fields.length; i++) {
                const obj = fields[i];
                const res = await obj['dao'].get()[obj.relation](row.id, this.getTable());
                retObj[obj['field']] = (await obj['dao'].get()['rowToClass'](res));
            }
            return retObj;
        } else return {};
    }

    async _update(bean) {
        throw new Error('This must be overriden');
    }


    async upsert(bean) {
        if (bean.id) return this._update(bean);
        else return this._insert(bean);
    }

}


class SquigBean {

    constructor(row) {
        Object.keys(row).forEach(key => this[key] = row[key]);
    }
}


module.exports = {SquigDao, SquigBean};
class Author extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Author(row);
    }


}


class Book extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Book(row);
    }


}


class Editor extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Editor(row);
    }


}


class Fans extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Fans(row);
    }


}

let AuthorInstance = null;

class AuthorDAO extends SquigDao {

    constructor(table = 'Author', clz = Author) {
        super(table, clz);
    }

    getRelatedFields() {
        return [
{
field: 'books',
table: 'Book',
dao: BookDAO,
relation: 'nToOneRelated'
},];
    }

    static get() {
        if (AuthorInstance) return AuthorInstance;
        else {
            AuthorInstance = new AuthorDAO();
            return AuthorInstance;
        }
    }
    async get( ){

        
            return this.nToOneReferenced(author.id, 'Fans');

        
    }
            
}
let BookInstance = null;

class BookDAO extends SquigDao {

    constructor(table = 'Book', clz = Book) {
        super(table, clz);
    }

    getRelatedFields() {
        return [
{
field: 'editors',
table: 'Editor',
dao: EditorDAO,
relation: 'nToNRelated'
},];
    }

    static get() {
        if (BookInstance) return BookInstance;
        else {
            BookInstance = new BookDAO();
            return BookInstance;
        }
    }
    async get( ){

        
            return this.oneToNReferenced(book.Author_id, 'Author');
        
    }
            
}
let EditorInstance = null;

class EditorDAO extends SquigDao {

    constructor(table = 'Editor', clz = Editor) {
        super(table, clz);
    }

    getRelatedFields() {
        return [
];
    }

    static get() {
        if (EditorInstance) return EditorInstance;
        else {
            EditorInstance = new EditorDAO();
            return EditorInstance;
        }
    }
    async get( ){

        
    }
            
}
let FansInstance = null;

class FansDAO extends SquigDao {

    constructor(table = 'Fans', clz = Fans) {
        super(table, clz);
    }

    getRelatedFields() {
        return [
{
field: 'author',
table: 'Author',
dao: AuthorDAO,
relation: 'oneToNRelated'
},];
    }

    static get() {
        if (FansInstance) return FansInstance;
        else {
            FansInstance = new FansDAO();
            return FansInstance;
        }
    }
    
}
module.exports = {AuthorDAO, Author,BookDAO, Book,EditorDAO, Editor,FansDAO, Fans};