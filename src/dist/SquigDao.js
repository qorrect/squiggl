const Connection = require('database-js').Connection;

class SquigDao {

    constructor(table, clz) {

        this.clz = clz;
        this.connection =
            // new Connection("sqlite:///path/to/test.sqlite"); // SQLite
            new Connection('mysql://root:m@localhost/CHARLIE_TEST'); // MySQL
// new Connection("postgres://user:password@localhost/test"); // PostgreSQL
        this._table = table;
    }

    getTable() {
        return this._table;
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
        }
        else return this._rowToClass(row);
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
        }
        else return {};
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