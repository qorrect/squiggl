const _ = require('lodash');

class Validator {


    static validate(models, options) {
        const requiredConfigs = ['vendor', 'username', 'password', 'schemaName'];
        const errorResponse = {
            errors: [],
            succeeded: true,
            hasRequired: true
        };

        errorResponse.hasRequired = requiredConfigs.every(key => !_.isEmpty(options[key]));

        models.forEach(model => {
            Object.keys(model).forEach(key => {
                const field = model[key];
                if (_.isObject(field)) {
                    if ('model' in field) {
                        if (!Validator.findModel(field.model, models)) {
                            errorResponse.errors.push(`The referenced model ${field.model} for the field ${key} could not be found`)
                        }
                    }
                }
            });
        });

        errorResponse.succeeded = errorResponse.errors.length === 0;
        return errorResponse;
    }

    static findModel(modelName, models) {
        return models.find(model => model['__model'] == modelName);
    }
}

module.exports = Validator;