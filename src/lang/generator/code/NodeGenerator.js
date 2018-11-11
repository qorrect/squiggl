const BaseCodeGenerator = require('./BaseCodeGenerator');
const _ = require('lodash');
const fs = require('fs');


class NodeGenerator extends BaseCodeGenerator {

    generateDao(model) {
        console.log( model );

        const compiled = _.template(fs.readFileSync(__dirname + '/NodeDao.template'));
        return compiled(model);
    }
}

module.exports = NodeGenerator;