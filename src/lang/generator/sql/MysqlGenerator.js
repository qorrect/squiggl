const BaseGenerator = require('./BaseGenerator');

class MysqlGenerator extends BaseGenerator {

    constructor(props) {
        super(props);

    }

    createTable(model) {
        return super.createTable(model);
    }

}

module.exports = MysqlGenerator;