const sysUtil = require('./utils/sysUtils');
const _ = require('lodash');
const Validator = require('./lang/Validator');
const PrettyPrinter = require('./lang/PrettyPrinter');
const SQLGenerator = require('./lang/generator/sql/SQLGenerator');

function safeExit(msg = 'You had some errors') {
    console.log(msg + ' ... Exiting');
    process.exit();
}

class SQG {
    static generate(obj, options) {
        const models = SQG.generateModels(obj);
        PrettyPrinter.print(models);
        console.log(JSON.stringify(options));
        const res = Validator.validate(models, options);
        if (!res.succeeded) {
            res.errors.forEach(e => console.log(e));
            safeExit();
        }
        if (!res.hasRequired) {
            safeExit('You are missing required options , put more detail here later');
        }

        const sql = SQG.generateSQL(models, options);
        console.log(sql);
    }


    static generateSQL(models, options) {
        const generator = SQLGenerator.get(options.vendor);
        let sql = '';
        sql += generator.createDatabase(options.schemaName);
        models.forEach(model => {
            sql += generator.createTable(model) + '\n';
        });
        return sql;

    }

    static generateModels(obj) {
        const models = [];
        Object.keys(obj).forEach(key => {
            obj[key]['_model'] = key;
            models.push(obj[key]);
        });
        return models;
    }

}

module.exports = {SQG};