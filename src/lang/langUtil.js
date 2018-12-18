const _ = require('lodash');
const {Strings} = require('../constants');

function isCustomType(obj, name) {
    return _.isObject(obj) && name !== Strings.REFERENCED_BY
        && name !== Strings.RELATED_FIELDS;
}

function isMetaType(field) {
    return field === Strings.REFERENCED_BY;
}

function stripSQLSizes(fields) {

    return fields.map(field => field.indexOf('(') === -1 ? field : field.substring(0, field.indexOf('(')))
}

module.exports = {isCustomType, isMetaType, stripSQLSizes};