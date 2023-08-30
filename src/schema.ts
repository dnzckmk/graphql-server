// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// 5 pirimitive types of graphl: int, float, string, boolean, ID (id of objects in grapql)
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id:ID!
    title: String
    author: Author # Author of the book
  }
  type Author {
    id:ID!,
    firstName: String!,
    lastName: String!,
    verified: Boolean!
    books: [Book!] # List of books of author
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    book(id:ID!): Book
    authors: [Author]
    author(id:ID!) : Author
  }
  type Mutation {
    addBook(book:AddBookInput!): Book
    deleteBook(id:ID!):[Book]
    updateBook(id:ID!, edits:UpdateBookInput!):Book

    addAuthor(author: AddAuthorInput!): Author
    deleteAuthor(id:ID!):[Author]
    updateAuthor(id:ID!, edits:UpdateAuthorInput!):Author
  }

  input AddBookInput {
    title: String!
    author_id: String
  }
  input UpdateBookInput {
    title: String
    author_id: String
  }
  
  input AddAuthorInput {
    firstName: String!,
    lastName: String!,
    verified: Boolean!
  }
  input UpdateAuthorInput {
    firstName: String,
    lastName: String,
    verified: Boolean
  }
`;
