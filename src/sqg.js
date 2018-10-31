const sysUtil = require('./utils/sysUtils');
const _ = require('lodash');
const Validator = require('./lang/Validator');
const PrettyPrinter = require('./lang/PrettyPrinter');
const FetchType = {
    EAGER: "Eager",
    LAZY: "lazy"
};

const Relation = {
    N_TO_ONE: 'N2ONE',
    ONE_TO_MANY: 'ONE_TO_MANY',
    N_TO_N: 'N_TO_N',
    ONE_TO_ONE: 'ONE_TO_ONE'

};

const Type = {
    String: 'String',
    Integer: 'Integer',
    UUID: 'UUID',
    Date: 'Date',
    Float: 'Float',
    Text: 'Text'
};

function safeExit() {
    console.log('You had some errors');
    process.exit();
}

class Generator {
    static generate(obj, options) {
        const models = Generator.generateModels(obj);
        PrettyPrinter.print(models);
        console.log(JSON.stringify(options));
        const res = Validator.validate(models, options);
        console.log(res);
    }


    static generateModels(obj) {
        const models = [];
        Object.keys(obj).forEach(key => {
            obj[key]['__model'] = key;
            models.push(obj[key]);
        });
        return models;
    }

}

module.exports = {FetchType, Relation, Type, Generator};