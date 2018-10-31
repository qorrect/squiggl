const Strings = {
    SQL: {
        Vendor: {
            MYSQL: 'mysql',
            POSTGRESQL: 'postgresql'
        }
    }
};

const SQGType = {
    String: function (size = 50) {
        return `varchar(${size})`;
    },
    Integer: function (size = 8) {
        return `int(${size})`;
    },
    UUID: 'UUID',
    Date: 'Date',
    Float: 'Float',
    Text: function () {
        return 'text ';
    }
};

const FetchType = {
    EAGER: "Eager",
    LAZY: "lazy"
};

const Relation = {
    MANY_TO_ONE: 'MANY_TO_ONE',
    ONE_TO_MANY: 'ONE_TO_MANY',
    MANY_TO_MANY: 'MANY_TO_MANY',
    ONE_TO_ONE: 'ONE_TO_ONE'

};


module.exports = {FetchType, Relation, Strings, SQGType};
