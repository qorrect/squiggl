const BaseCodeGenerator = require('./BaseCodeGenerator');
const _ = require('lodash');
const fs = require('fs');


class NodeGenerator extends BaseCodeGenerator {

    generateDao(model) {

        const compiled = _.template(fs.readFileSync(__dirname + '/NodeDao.template'));
        const relatedFields = "testing";
        return compiled({model, relatedFields});
    }

    generateBean(model) {

        const compiled = _.template(fs.readFileSync(__dirname + '/NodeBean.template'));
        return compiled({model});
    }
}

module.exports = NodeGenerator;