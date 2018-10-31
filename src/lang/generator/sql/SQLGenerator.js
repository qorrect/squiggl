const {Strings} = require('../../../constants');
const MysqlGenerator = require('./MysqlGenerator');

class SQLGenerator {

    constructor(props) {
        this.options = props;
    }

    /**
     *
     * @param vendor
     * @param options
     * @return {BaseGenerator}
     */
    static get(vendor, options) {
        if (vendor.toLowerCase() === Strings.SQL.Vendor.MYSQL) {
            return new MysqlGenerator(options);
        }
        else throw new Error(`Couldnt find SQL generator for vendor ${vendor}`);
    }
}

module.exports = SQLGenerator;