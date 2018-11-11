const {BookDAO, AuthorDAO} = require('./dao');

async function main() {

    const author = await AuthorDAO.get()._findById(1);
    // const fans = author.getFans();
    // const fans = await AuthorDAO.get().getFans(author);
    console.log(JSON.stringify(fans, null, 4));
    // console.log(JSON.stringify(author, null, 4));

    // const book = await BookDAO.get()._findById(1);
    // console.log(JSON.stringify(book, null, 4));
    // const bookAuthor = await BookDAO.get().getAuthor(book);
    // console.log(JSON.stringify(bookAuthor, null, 4));
    return;
}

main().then(() => process.exit());