const {SquigBean, SquigDao} = require('../src/dist/SquigDao');

class Author extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Author(row);
    }
}


class Editor extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Author(row);
    }
}


class Book extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Book(row);
    }
}

let authorInstance = null;
let bookInstance = null;
let editorInstance = null;

class BookDAO extends SquigDao {

    constructor(table = 'Book', clz = Book) {
        super(table, clz);
    }

    getRelatedFields() {
        return [{
            field: 'editors',
            table: 'Editor',
            dao: EditorDAO,
            relation: 'nToNRelated'
        }];
    }

    static get() {
        if (bookInstance) return bookInstance;
        else {
            bookInstance = new BookDAO();
            return bookInstance;
        }
    }

}


class EditorDAO extends SquigDao {

    constructor(table = 'Editor', clz = Editor) {
        super(table, clz);
    }

    static get() {
        if (editorInstance) return editorInstance;
        else {
            editorInstance = new EditorDAO();
            return editorInstance;
        }
    }

}

class AuthorDAO extends SquigDao {

    constructor(table = 'Author', clz = Author, factory = AuthorDAO) {
        super(table, clz, factory);
    }

    getRelatedFields() {
        return [{
            field: 'books',
            table: 'Book',
            dao: BookDAO,
            relation: 'nToOneRelated'
        }];
    }


    static get() {
        if (authorInstance) return authorInstance;
        else {
            authorInstance = new AuthorDAO();
            return authorInstance;
        }
    }


}

async function main() {

    const author = await AuthorDAO.get()._findById(1);

    console.log(JSON.stringify(author, null, 4));


}

main().then(() => process.exit());