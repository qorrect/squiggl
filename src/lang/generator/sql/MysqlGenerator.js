const BaseSQLGenerator = require('./BaseSQLGenerator');

class MysqlGenerator extends BaseSQLGenerator {

    constructor(props) {
        super(props);

    }

    createTable(model) {
        return super.createTable(model);
    }

}

module.exports = MysqlGenerator;