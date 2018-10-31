const sqg = require('./sqg');
const constants = require('./sqg/constants');


const Author = {
    name: String,
    age: Number,
    books: {model: "Book", relation: sqg.Relation.ONE_TO_MANY}
}

const Book = {
    title: String,
    year: Number,
    author: {model: "Author", relation: sqg.Relation.ONE_TO_ONE}

};


console.log(JSON.stringify(Author, 4, null));
console.log(JSON.stringify(Book, 4, null));
