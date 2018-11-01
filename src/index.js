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
const Editor = {
    name: SQGType.String(),
    yearEstablished: SQGType.Integer()
};

const Author = {
    name: SQGType.String(120),
    age: SQGType.Integer(),
    books: {model: "Book", relation: Relation.ONE_TO_MANY, fetchType: FetchType.EAGER}
};

const Book = {
    title: SQGType.String(),
    contents: SQGType.Text(),
    publishDate: SQGType.Date(),
    publisher: {model: "Editor", relation: Relation.MANY_TO_MANY, fetchType: FetchType.EAGER}
};

SQG.generate({Author, Book, Editor}, options);
