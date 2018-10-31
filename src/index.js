const {SQG} = require('./sqg');
const {SQGType, Relation, FetchType} = require('./constants');

const options = {
    database: 'library',
    vendor: 'mysql',
    username: 'root',
    password: 'm',
    language: 'node',
    schemaName: 'CHARLIE_TEST',
    createTables: true
};

const Author = {
    name: SQGType.String(),
    age: SQGType.Integer(),
    // books: {model: "Book", relation: Relation.ONE_TO_MANY, fetchType: FetchType.EAGER}
};

const Book = {
    title: SQGType.String(),
    contents: SQGType.Text(),
    author: {model: "Author", relation: Relation.MANY_TO_ONE, fetchType: FetchType.EAGER},
    publishDate: SQGType.Date
};

SQG.generate({Author, Book}, options);
