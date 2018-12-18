const BaseSQLGenerator = require('./BaseSQLGenerator');

class MysqlGenerator extends BaseSQLGenerator {

    createDatabase(name) {
        return `CREATE DATABASE ${name};SET search_path TO ${name};\n`;
    }
    constructor(props) {
        super(props);

    }

    createTable(model) {
        return super.createTable(model);
    }

    /**
     * @override
     * @returns {string} - returns sql
     */
    createPrimaryKey() {
        return ' id SERIAL PRIMARY KEY ';
    }

    /**
     * @override
     * @returns {string}
     */
    createIndexOnManyToMany() {
        return '';
    }

}

module.exports = MysqlGenerator;