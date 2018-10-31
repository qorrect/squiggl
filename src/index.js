const {Relation, Type, Generator} = require('./sqg');

const options = {
    database: 'library',
    vendor: 'mysql',
    username: 'root',
    password: 'm',
    language: 'java',
    createTables: true
};

const Author = {
    name: Type.String,
    age: Type.Integer,
    books: {model: "Book", relation: Relation.ONE_TO_MANY}
};

const Book = {
    title: Type.String,
    contents: Type.Text,
    publishDate: Type.Date
};

Generator.generate({Author, Book}, options);
