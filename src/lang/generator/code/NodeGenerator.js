const BaseCodeGenerator = require('./BaseCodeGenerator');
const _ = require('lodash');
const fs = require('fs');
const langUtil = require('../../langUtil');


class NodeGenerator extends BaseCodeGenerator {

    generateDao(model) {

        const compiled = _.template(fs.readFileSync(__dirname + '/NodeDao.template'));
        let relatedFields = '\n';
        Object.keys(model).forEach(key => {
            const field = model[key];
            if (langUtil.isCustomType(field, key)) {
                console.log(field);
                console.log('\n\n\nHERE\n\n');
                relatedFields += "{\n";
                relatedFields += "field: '" + key + "',\n";
                relatedFields += "table: '" + field.originalModel + "',\n";
                relatedFields += "dao: " + field.originalModel + "DAO,\n";
                relatedFields += "relation: '" + this.translateRelation(field.relation) + "'\n";

                relatedFields += "},";
            }
        });
        return compiled({model, relatedFields});
    }

    generateBean(model) {

        const compiled = _.template(fs.readFileSync(__dirname + '/NodeBean.template'));
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
}

module.exports = NodeGenerator;