const _ = require('lodash');
const {SQGType, Relation, FetchType} = require('../../../constants');

class BaseGenerator {

    createDatabase(name) {
        return `CREATE DATABASE IF NOT EXISTS ${name}\n`;
    }

    prune(model, fields = ['_model']) {
        fields.forEach(field => {
            delete model[field];
        });
        return model;
    }

    createTable(model) {
        let sql = `CREATE TABLE ${model._model} (`;
        const fields = [], keys = [];
        Object.keys(this.prune(model)).forEach(field => {
            // Its a non-primitive type
            const fieldObj = model[field];
            const id = fieldObj.model + '_id';

            if (_.isObject(fieldObj)) {
                if (fieldObj.relation === Relation.MANY_TO_ONE ||
                    fieldObj.relation === Relation.MANY_TO_MANY) {
                    fields.push(id + ' int');
                    keys.push(`FOREIGN KEY (${id}) REFERENCES ${fieldObj.model} (id)`);

                }
            }
            // Its a primitive type
            else {
                fields.push(field + ' ' + fieldObj);
            }
        });
        let key_clause = keys.length ? keys.join(',') + ',' : '';
        sql += fields.join(',') + ' , ' + key_clause + this.createPrimaryKey() + ' )';
        return sql + ';';
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

module.exports = BaseGenerator;
