const NodeGenerator = require('./NodeGenerator');

class CodeGenerator {

    static get(lang) {
        switch (lang) {
            case 'js':
            case 'node' :
                return new NodeGenerator();
            default:
                throw new Error(`No generator found for ${lang}`);
        }
    }
}

module.exports = CodeGenerator;