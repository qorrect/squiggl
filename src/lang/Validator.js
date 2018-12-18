const _ = require('lodash');
const langUtil = require('../lang/langUtil');

class Validator {


    static validate(models, options) {
        const requiredConfigs = ['vendor', 'user', 'password', 'database_name','host'];
        const errorResponse = {
            errors: [],
            succeeded: true,
            hasRequired: true
        };

        errorResponse.hasRequired = requiredConfigs.every(key => !_.isEmpty(options[key]));

        models.forEach(model => {
            Object.keys(model).forEach(key => {
                const field = model[key];
                if (langUtil.isCustomType(field, key)) {
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
        return models.find(model => model['_model'] == modelName);
    }
}

module.exports = Validator;