const BaseCodeGenerator = require('./BaseCodeGenerator');
const _ = require('lodash');
const fs = require('fs');
const langUtil = require('../../langUtil');


class NodeGenerator extends BaseCodeGenerator {

    generateDao(model) {

        const compiled = this.compile(__dirname + '/NodeDao.template');
        let relatedFields = '\n';
        const refBy = [];

        Object.keys(model).forEach(key => {
            const field = model[key];
            if (langUtil.isCustomType(field, key)) {

                relatedFields += "{\n";
                relatedFields += "field: '" + key + "',\n";
                relatedFields += "table: '" + field.originalModel + "',\n";
                relatedFields += "dao: " + field.originalModel + "DAO,\n";
                relatedFields += "relation: '" + this.translateRelation(field.relation) + "'\n";

                relatedFields += "},";
            } else if (langUtil.isMetaType(key)) {
                refBy.push(field);
            }
        });
        return compiled({model, relatedFields, refBy});
    }

    generateBean(model) {

        const compiled = this.compile(__dirname + '/NodeBean.template');
        return compiled({model});
    }

    translateRelation(relation) {
        switch (relation) {
            case 'MANY_TO_ONE' :
                return 'oneToNRelated';
            case 'MANY_TO_MANY' :
                return 'nToNRelated';
            case 'ONE_TO_MANY' :
                return 'nToOneRelated';
            case 'ONE_TO_ONE' :
                return 'oneToOneRelated';
            default:
                throw new Error(`No relation type found for ${relation}, I only know about [ MANY_TO_ONE ,MANY_TO_MANY , ONE_TO_MANY, ONE_TO_ONE`);

        }
        return relation;
    }

    generateImports(options, sql) {
        const compiled = this.compile((__dirname + '/SquigDao.template'));
        return compiled({options, sql: sql.substr(sql.indexOf('\n')).replace(/\n/,'')});

    }

    generateExports(models) {
        let code = 'module.exports = {';
        models.forEach(model => {
            code += `${model._model}DAO, ${model._model},`;
        });
        code = code.substring(0, code.length - 1) + '};';
        return code;
    }
}

module.exports = NodeGenerator;