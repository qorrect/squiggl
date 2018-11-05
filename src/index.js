const {SQG} = require('./sqg');
const {Type, Relation, FetchType} = require('./constants');

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
    name: Type.String(),
    yearEstablished: Type.Integer()
};

const Author = {
    name: Type.String(120),
    age: Type.Integer(),
    books: {model: "Book", relation: Relation.ONE_TO_MANY, fetchType: FetchType.EAGER}
};

const Book = {
    title: Type.String(),
    contents: Type.Text(),
    publishDate: Type.Date(),
    publisher: {model: "Editor", relation: Relation.MANY_TO_MANY, fetchType: FetchType.EAGER}
};

SQG.generate({Author, Book, Editor}, options);
