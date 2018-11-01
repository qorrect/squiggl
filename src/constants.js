const Strings = {
    SQL: {
        Vendor: {
            MYSQL: 'mysql',
            POSTGRESQL: 'postgresql'
        }
    },
    REFERENCED_BY: 'referencedBy'
};

const SQGType = {
    String: (size = 50) => `varchar(${size})`,

    Integer: (size = 8) => `int(${size})`,
    UUID: 'UUID',
    Date: () => 'Date',
    Float: 'Float',
    Text: () => 'text'
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
