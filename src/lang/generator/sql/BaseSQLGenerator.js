const _ = require('lodash');
const {SQGType, Relation, Strings} = require('../../../constants');
const langUtil = require('../../langUtil');
const logger = require('../../../utils/logUtil');
const {clone} = require('../../../utils/sysUtils');

class BaseSQLGenerator {

    createDatabase(name) {
        return `CREATE DATABASE IF NOT EXISTS ${name};USE ${name};\n`;
    }

    prune(model, fields = ['_model']) {
        const ret = clone(model);
        fields.forEach(field => {
            delete ret[field];
        });
        return ret;
    }

    createTable(model) {
        let sql = `CREATE TABLE ${model._model} (`;
        const fields = [], keys = [], manyToMany = [];
        Object.keys(this.prune(model)).forEach(field => {
            // Its a non-primitive type

            const fieldObj = model[field];
            const id = fieldObj.originalModel + '_id';

            if (langUtil.isCustomType(fieldObj, field)) {
                if (fieldObj.relation === Relation.MANY_TO_ONE) {
                    fields.push(id + ' int');
                    keys.push(`FOREIGN KEY (${id}) REFERENCES ${fieldObj.originalModel} (id)`);

                }
            }
            // Its a primitive type
            else if (!langUtil.isMetaType(field)) {
                fields.push(field + ' ' + fieldObj);
            }
            else {
                logger.warn('Doing nothing with field type ' + field)
            }
        });

        if (!_.isEmpty(model[Strings.REFERENCED_BY])) {
            const refBy = model[Strings.REFERENCED_BY];
            if (refBy.relation === Relation.ONE_TO_MANY ||
                refBy.relation === Relation.ONE_TO_ONE) {
                fields.push(refBy.refByModel + '_id int');
            }
            else if (refBy.relation === Relation.MANY_TO_MANY) {
                manyToMany.push({relation: refBy.relation, model: refBy.originalModel, refByModel: refBy.refByModel});
            }
        }

        let key_clause = keys.length ? keys.join(',') + ',' : '';
        sql += fields.join(',') + ' , ' + key_clause + this.createPrimaryKey() + ' )';
        sql += ';';

        manyToMany.forEach(obj => {
            const modelId = obj.model + '_id';
            const refId = obj.refByModel + '_id';
            sql += `\nCREATE TABLE ${obj.model}_${obj.refByModel} (${modelId} int, ${refId} int,  ` +
                this.createPrimaryKey() + `, INDEX lookup(${modelId},${refId}) );`;
        });
        return sql;
    }

    createPrimaryKey() {
        return ' id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ';
    }

    /**
     *
     * @param {SQGType} type
     */
    getSqlType(type) {
        return type;
    }

    generatePrimaryKey() {
        return ' id INT NOT NULL AUTO_INCREMENT PRIMARY KEY ';
    }

    relatedByManyToManySQL() {
        return "id in (SELECT %s_id FROM %s_%s  WHERE %s_id "
    }


}

module.exports = BaseSQLGenerator;
