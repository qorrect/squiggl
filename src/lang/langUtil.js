const _ = require('lodash');
const {Strings} = require('../constants');

function isCustomType(obj, name) {
    return _.isObject(obj) && name !== Strings.REFERENCED_BY;
}

function isMetaType(field) {
    return field === Strings.REFERENCED_BY;
}

module.exports = {isCustomType, isMetaType};