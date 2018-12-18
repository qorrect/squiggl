const _ = require('lodash');
const fs = require('fs');

class BaseCodeGenerator {


    constructor() {
        this.templateSettings = {
            evaluate: /<\?([\s\S]+?)\?>/g,
            interpolate : /\{\{([\s\S]+?)\}\}/g,

        };

    }

    compile(path) {
        return _.template(fs.readFileSync(path), this.templateSettings);
    }

    generateDao(model) {
        throw new Error('This must be overriden');
    }

}

module.exports = BaseCodeGenerator;