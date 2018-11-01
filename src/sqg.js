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
        const models = SQG.populateOppositeRelation(SQG.generateModels(obj));
        // PrettyPrinter.print(models);
        const res = Validator.validate(models, options);
        if (!res.succeeded) {
            res.errors.forEach(e => console.log(e));
            safeExit();
        }
        if (!res.hasRequired) {
            safeExit('You are missing required options , put more detail here later');
        }

        const sql = SQG.generateSQL(models, options);
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

    static generateModelMap(models) {
        const map = {};
        models.forEach(model => {
            map[model._model] = model;
        });
        return map;
    }

    static populateOppositeRelation(models) {
        const map = SQG.generateModelMap(models);
        console.log(JSON.stringify(map, null, 4));
        Object.keys(map).forEach(modelName => {
            const model = map[modelName];
            Object.keys(model).forEach(field => {
                // Its a non-primitive type
                const fieldObj = model[field];
                const id = fieldObj.model + '_id';

                if (_.isObject(fieldObj)) {
                    console.log(fieldObj.model);
                }
                // Its a primitive type
                else {
                }
            });
        });

        return models;
    }

}

module.exports = {SQG};