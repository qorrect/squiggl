const {Author, BookDAO, AuthorDAO} = require('./dao');

async function main() {

    // const author = await AuthorDAO.get()._findById(1);
    // // const fans = author.getFans();
    // const fans = await AuthorDAO.get().getFans(author);
    // console.log(JSON.stringify(fans, null, 4));
    // console.log(JSON.stringify(author, null, 4));
    //
    // const book = await BookDAO.get()._findById(1);
    // console.log(JSON.stringify(book, null, 4));
    // const bookAuthor = await BookDAO.get().getAuthor(book);
    // console.log(JSON.stringify(bookAuthor, null, 4));
    //
    // const authors = await AuthorDAO.get()._find('age > ? AND name like ?', '0', '%charlie%');
    // console.log(JSON.stringify(authors, null, 4));

    const author = new Author( {name: 'Ernio Hummingway', age: -1});
    AuthorDAO.get()._insert(author);
}

main();