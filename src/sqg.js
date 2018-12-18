const {clone} = require('./utils/sysUtils');
const _ = require('lodash');
const Validator = require('./lang/Validator');
const PrettyPrinter = require('./lang/PrettyPrinter');
const SQLGenerator = require('./lang/generator/sql/SQLGenerator');
const CodeGenerator = require('./lang/generator/code/CodeGenerator');
const fs = require('fs');

const {Strings} = require('./constants');
const langUtil = require('./lang/langUtil');

process.on('uncaughtException', (err) => {
    console.log('Fatal error encountered!\n\n', err.message);
});

function safeExit(msg = 'You had some errors') {
    console.log(msg + ' ... Exiting');
    process.exit();
}

class SQG {
    static generate(obj, _options) {
        const models = SQG.populateOppositeRelation(SQG.generateModels(obj));
        const options = SQG.ensureDefaultOptions(_options);
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
        // console.log(sql);
        SQG.write(sql, 'squig.sql', options.outdir);
        const code = SQG.generateCode(models, options, sql);
        SQG.write(code, 'dao.js', options.outdir)
        // console.log(code);
    }

    static write(data, file, dir) {
        fs.writeFileSync(dir + '/' + file, data);
    }


    static generateSQL(models, options) {
        const generator = SQLGenerator.get(options.vendor);
        let sql = '';
        sql += generator.createDatabase(options.database_name);
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
                let modelName = fieldObj.model;

                if (langUtil.isCustomType(fieldObj, fieldName)) {
                    const opposite = map[modelName];
                    if (!opposite) {
                        throw new Error('Model ' + modelName + ' not found ( referenced by ' + modelName + ' ) , did you pass it to generate() ?');
                    }
                    opposite[Strings.REFERENCED_BY] = fieldObj;
                    opposite[Strings.REFERENCED_BY].originalModel = opposite[Strings.REFERENCED_BY].model;
                    delete opposite[Strings.REFERENCED_BY].model;
                    opposite[Strings.REFERENCED_BY].refByModel = model._model;
                }
                // Its a primitive type
                else {
                }
            });
        });

        return models;
    }

    static generateCode(models, options, sql) {
        const generator = CodeGenerator.get(options.language);
        let code = generator.generateImports(options, sql);
        models.forEach(model => {
            code += generator.generateBean(model);
        });

        models.forEach(model => {
            code += generator.generateDao(model);
        });
        code += generator.generateExports(models);

        return code;
    }

    static ensureDefaultOptions(_options) {
        const options = clone(_options);
        options.outdir = options.outdir ? options.outdir : 'squig_out/';
        options.driver = options.driver ? options.driver : SQG.getDriver(options.vendor);
        return options;
    }

    static getDriver(vendor) {
        switch (vendor) {
            case 'mysql':
                return 'mysql';
            case 'postgresql' :
                return 'database-js-postgres';
        }
    }
}

module.exports = {SQG};