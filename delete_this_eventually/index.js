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


class Book extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Book(row);
    }
}


class Editor extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Editor(row);
    }
}


class Fans extends SquigBean {
    //
    constructor(props) {
        super(props);
    }

    static create(row) {
        return new Fans(row);
    }
}



let AuthorInstance = null;

class AuthorDAO extends SquigDao {

    constructor(table = 'Author', clz = Author) {
        super(table, clz);
    }

    getRelatedFields() {
        return [
            {
                field: 'books',
                table: 'Book',
                dao: BookDAO,
                relation: 'nToOneRelated'
            },];
    }

    static get() {
        if (AuthorInstance) return AuthorInstance;
        else {
            AuthorInstance = new AuthorDAO();
            return AuthorInstance;
        }
    }
    getFans( fans){

    }
}
let BookInstance = null;

class BookDAO extends SquigDao {

    constructor(table = 'Book', clz = Book) {
        super(table, clz);
    }

    getRelatedFields() {
        return [
            {
                field: 'editors',
                table: 'Editor',
                dao: EditorDAO,
                relation: 'nToNRelated'
            },];
    }

    static get() {
        if (BookInstance) return BookInstance;
        else {
            BookInstance = new BookDAO();
            return BookInstance;
        }
    }
    getAuthor( author){

    }
}
let EditorInstance = null;

class EditorDAO extends SquigDao {

    constructor(table = 'Editor', clz = Editor) {
        super(table, clz);
    }

    getRelatedFields() {
        return [
        ];
    }

    static get() {
        if (EditorInstance) return EditorInstance;
        else {
            EditorInstance = new EditorDAO();
            return EditorInstance;
        }
    }
    getBook( book){

    }
}
let FansInstance = null;

class FansDAO extends SquigDao {

    constructor(table = 'Fans', clz = Fans) {
        super(table, clz);
    }

    getRelatedFields() {
        return [
            {
                field: 'author',
                table: 'Author',
                dao: AuthorDAO,
                relation: 'oneToNRelated'
            },];
    }

    static get() {
        if (FansInstance) return FansInstance;
        else {
            FansInstance = new FansDAO();
            return FansInstance;
        }
    }

}

async function main() {

    const author = await AuthorDAO.get()._findById(1);

    console.log(JSON.stringify(author, null, 4));


}

main().then(() => process.exit());