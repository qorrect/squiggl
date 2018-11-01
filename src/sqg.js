const sysUtil = require('./utils/sysUtils');
const _ = require('lodash');
const Validator = require('./lang/Validator');
const PrettyPrinter = require('./lang/PrettyPrinter');
const SQLGenerator = require('./lang/generator/sql/SQLGenerator');
const {Strings} = require('./constants');
const langUtil = require('./lang/langUtil');

process.on('uncaughtException', (err) => {
    console.log('Fatal error encountered!\n\n', err.message  );
});

function safeExit(msg = 'You had some errors') {
    console.log(msg + ' ... Exiting');
    process.exit();
}

class SQG {
    static generate(obj, options) {
        const models = SQG.populateOppositeRelation(SQG.generateModels(obj));
        PrettyPrinter.print(models);
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

    static generateModelMap(models) {
        const map = {};
        models.forEach(model => {
            map[model._model] = model;
        });
        return map;
    }

    static populateOppositeRelation(models) {
        const map = SQG.generateModelMap(models);
        Object.keys(map).forEach(modelName => {
            const model = map[modelName];
            Object.keys(model).forEach(fieldName => {
                // Its a non-primitive type
                const fieldObj = model[fieldName];
                const id = fieldObj._model + '_id';

                if (langUtil.isCustomType(fieldObj, fieldName)) {
                    const opposite = map[fieldObj.model];
                    if (!opposite) {
                        throw new Error('Model ' + fieldObj.model + ' not found ( referenced by ' + modelName + ' ) , did you pass it to generate() ?');
                    }
                    opposite[Strings.REFERENCED_BY] = fieldObj;
                    opposite[Strings.REFERENCED_BY].originalModel = opposite[Strings.REFERENCED_BY].model;
                    delete opposite[Strings.REFERENCED_BY].model;
                    opposite[Strings.REFERENCED_BY].refByModel = modelName;
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