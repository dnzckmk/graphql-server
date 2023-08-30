import db from "./_db.js";

let generateId = (): String => Math.floor(Math.random() * 10000).toString();

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
  Query: {
    books: () => db.books,
    authors: () => db.authors,
    book: (_, args) => db.books.find((book) => book.id === args.id),
    author: (_, args) => db.authors.find((author) => author.id === args.id),
  },
  Book: {
    author: (parent) =>
      db.authors.find((author) => author.id === parent.author_id),
  },
  Author: {
    books: (parent) => db.books.filter((book) => book.author_id === parent.id),
  },
  Mutation: {
    //Book
    addBook: (_, args) => {
      let book = {
        ...args.book,
        id: generateId(),
      };
      db.books.push(book);
      return book;
    },
    deleteBook: (_, args) => db.books.filter((book) => book.id !== args.id),
    updateBook: (_, args) => {
      db.books = db.books.map((book) => {
        if (book.id === args.id) {
          return { ...book, ...args.edits };
        }
        return book;
      });
      return db.books.find((book) => book.id === args.id);
    },
    // Author
    addAuthor: (_, args) => {
      let author = {
        ...args.author,
        id: generateId(),
      };
      db.authors.push(author);
      return author;
    },
    deleteAuthor: (_, args) =>
      db.authors.filter((author) => author.id !== args.id),
    updateAuthor: (_, args) => {
      db.authors = db.authors.map((author) => {
        if (author.id === args.id) {
          return { ...author, ...args.edits };
        }
        return author;
      });
      return db.authors.find((author) => author.id === args.id);
    },
  },
};
