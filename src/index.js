const {SQG} = require('./sqg');
const {Type, Relation} = require('./constants');

const options = {
    database: 'library',
    vendor: 'postgresql',
    user: 'root',
    password: 'm',
    language: 'node',
    host: 'localhost',
    database_name: 'squig_test',
    outdir: 'delete_this_eventually',
    createTables: true
};

const Author = {
    name: Type.String(120),
    age: Type.Integer(),
    books: {model: "Book", relation: Relation.ONE_TO_MANY}
};

const Editor = {
    name: Type.String(),
    yearEstablished: Type.Integer()
};

const Book = {
    title: Type.String(),
    contents: Type.Text(),
    publishDate: Type.Date(),
    editors: {model: "Editor", relation: Relation.MANY_TO_MANY}
};

const Fans = {
    title: Type.String(),
    author: {model: "Author", relation: Relation.MANY_TO_ONE}
};

SQG.generate({Author, Book, Editor, Fans}, options);
