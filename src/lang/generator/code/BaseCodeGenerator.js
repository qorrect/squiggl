
class BaseCodeGenerator {

    generateDao(model) {
       throw new Error('This must be overriden');
    }

}

module.exports = BaseCodeGenerator;