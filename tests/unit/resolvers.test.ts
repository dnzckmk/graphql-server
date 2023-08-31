import { ApolloServer, BaseContext } from "@apollo/server";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../../src/schema";
import { resolvers } from "../../src/resolvers";
import { expect, describe, it } from "@jest/globals";
import assert from "node:assert";

const mocks = {
  Books: () => [
    { id: "1", title: "The Awakening" },
    { id: "2", title: "City of Glass" },
  ],
  BookId: () => ({ id: 1 }),
  BookById: () => ({
    id: "1",
    title: "The Awakening",
  }),
  AddBookInput: () => ({
    book: {
      title: "The Storm",
    },
  }),
  AddedBook: () => ({
    id: expect.any(String),
    title: "The Storm",
  }),
  UpdateBookInput: () => ({
    id: "2",
    edits: {
      title: "The Story of an Hour",
      author_id: "1",
    },
  }),
  UpdatedBook: () => ({
    id: "2",
    title: "The Story of an Hour",
    author: {
      id: "1",
    },
  }),
  DeleteBook: () => ({ id: 1 }),
  BooksAfterDelete: () => [
    { id: "2", title: "The Story of an Hour" },
    { id: expect.any(String), title: "The Storm" },
  ],
  Authors: () => [
    {
      id: "1",
      firstName: "Kate",
      lastName: "Chopin",
      verified: true,
    },
    {
      id: "2",
      firstName: "Paul",
      lastName: "Auster",
      verified: true,
    },
  ],
  AuthorId: () => ({ id: "1" }),
  AuthorById: () => ({
    id: "1",
    firstName: "Kate",
    lastName: "Chopin",
    verified: true,
  }),
  AddAuthorInput: () => ({
    author: {
      firstName: "Harper",
      lastName: "Lee",
      verified: false,
    },
  }),
  AddedAuthor: () => ({
    id: expect.any(String),
    firstName: "Harper",
    lastName: "Lee",
    verified: false,
  }),
  UpdateAuthorInput: () => ({
    id: "2",
    edits: {
      firstName: "George",
      lastName: "Orwell",
      verified: false,
    },
  }),
  UpdatedAuthor: () => ({
    id: "2",
    firstName: "George",
    lastName: "Orwell",
    verified: false,
    books: [],
  }),
  DeleteAuthor: () => ({ id: 2 }),
  AuthorsAfterDelete: () => [
    {
      id: "1",
      firstName: "Kate",
      lastName: "Chopin",
      verified: true,
    },
    {
      id: expect.any(String),
      firstName: "Harper",
      lastName: "Lee",
      verified: false,
    },
  ],
};
const queries = {
  booksQuery: "query Books { books { id title } }",
  bookByIdQuery: "query Book($id:ID!) { book(id:$id) { id title } }",
  addBookMutation:
    "mutation AddBook($book:AddBookInput!) { addBook(book:$book) { id title } }",
  updateBookMutation:
    "mutation UpdateBook($id:ID!, $edits:UpdateBookInput!) { updateBook(id:$id, edits:$edits) { id title author { id } } }",
  deleteBookMutation:
    "mutation DeleteBook($id:ID!) { deleteBook(id:$id) { id title } }",
  authorsQuery: "query Authors { authors {id firstName lastName verified }}",
  authorByIdQuery:
    "query Author($id:ID!){ author(id:$id){id firstName lastName verified}}",
  addAuthorMutation:
    "mutation AddAuthor($author:AddAuthorInput!){ addAuthor(author:$author){ id firstName lastName verified }}",
  updateAuthorMutation:
    "mutation UpdateAuthor($id:ID!, $edits:UpdateAuthorInput!){updateAuthor(id:$id, edits:$edits){id firstName lastName verified books{id}}}",
  deleteAuthorMutation:
    "mutation DeleteAuthor($id:ID!){ deleteAuthor(id:$id){id firstName lastName verified}}",
};

let testServer: ApolloServer<BaseContext>;
beforeAll(() => {
  testServer = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({ typeDefs, resolvers }),
      mocks,
      preserveResolvers: true,
    }),
  });
});

describe("Test for book related resolvers", function () {
  test("Query Books should return list of books", async () => {
    // const testServer = new ApolloServer({
    //   schema: addMocksToSchema({
    //     schema: makeExecutableSchema({ typeDefs, resolvers }),
    //     mocks,
    //     preserveResolvers: true,
    //   }),
    // });

    const response = await testServer.executeOperation({
      query: queries.booksQuery,
      variables: {},
    });

    const expected = mocks.Books();

    // Note the use of Node's assert rather than Jest's expect; if using
    // TypeScript, `assert`` will appropriately narrow the type of `body`
    // and `expect` will not.
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.books).toEqual(expected);

    console.log(
      "1-RESPONSE: ",
      response.body.singleResult.data?.books,
      "1-EXPECTED:",
      expected
    );
  });

  test("Query book by id should return the book", async () => {
    const response = await testServer.executeOperation({
      query: queries.bookByIdQuery,
      variables: mocks.BookId(),
    });

    const expected = mocks.BookById();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.book).toEqual(expected);

    console.log(
      "2-RESPONSE: ",
      response.body.singleResult.data?.book,
      "2-EXPECTED:",
      expected
    );
  });

  test("AddBook mutation should return the added book", async () => {
    const response = await testServer.executeOperation({
      query: queries.addBookMutation,
      variables: mocks.AddBookInput(),
    });

    const expected = mocks.AddedBook();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.addBook).toEqual(expected);

    console.log(
      "3-RESPONSE: ",
      response.body.singleResult.data?.addBook,
      "3-EXPECTED:",
      expected
    );
  });

  test("UpdateBook mutation should return the updated book", async () => {
    const response = await testServer.executeOperation({
      query: queries.updateBookMutation,
      variables: mocks.UpdateBookInput(),
    });

    const expected = mocks.UpdatedBook();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.updateBook).toEqual(expected);

    console.log(
      "4-RESPONSE: ",
      response.body.singleResult.data?.updateBook,
      "4-EXPECTED:",
      expected
    );
  });

  test("DeleteBook mutation should return the list of books except the deleted one", async () => {
    const response = await testServer.executeOperation({
      query: queries.deleteBookMutation,
      variables: mocks.DeleteBook(),
    });

    const expected = mocks.BooksAfterDelete();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.deleteBook).toEqual(expected);

    console.log(
      "5-RESPONSE: ",
      response.body.singleResult.data?.deleteBook,
      "5-EXPECTED:",
      expected
    );
  });
});

describe("Test for author related resolvers", function () {
  test("Query Authors should return list of authors", async () => {
    const response = await testServer.executeOperation({
      query: queries.authorsQuery,
      variables: {},
    });

    const expected = mocks.Authors();

    // Note the use of Node's assert rather than Jest's expect; if using
    // TypeScript, `assert`` will appropriately narrow the type of `body`
    // and `expect` will not.
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.authors).toEqual(expected);

    console.log(
      "1-RESPONSE: ",
      response.body.singleResult.data?.authors,
      "1-EXPECTED:",
      expected
    );
  });

  test("Query author by id should return the author", async () => {
    const response = await testServer.executeOperation({
      query: queries.authorByIdQuery,
      variables: mocks.AuthorId(),
    });

    const expected = mocks.AuthorById();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.author).toEqual(expected);

    console.log(
      "2-RESPONSE: ",
      response.body.singleResult.data?.author,
      "2-EXPECTED:",
      expected
    );
  });

  test("AddAuthor mutation should return the added author", async () => {
    const response = await testServer.executeOperation({
      query: queries.addAuthorMutation,
      variables: mocks.AddAuthorInput(),
    });

    const expected = mocks.AddedAuthor();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.addAuthor).toEqual(expected);

    console.log(
      "3-RESPONSE: ",
      response.body.singleResult.data?.addAuthor,
      "3-EXPECTED:",
      expected
    );
  });

  test("UpdateAuthor mutation should return the updated author", async () => {
    const response = await testServer.executeOperation({
      query: queries.updateAuthorMutation,
      variables: mocks.UpdateAuthorInput(),
    });

    const expected = mocks.UpdatedAuthor();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.updateAuthor).toEqual(expected);

    console.log(
      "4-RESPONSE: ",
      response.body.singleResult.data?.updateAuthor,
      "4-EXPECTED:",
      expected
    );
  });

  test("DeleteAuthor mutation should return the list of authors except the deleted one", async () => {
    const response = await testServer.executeOperation({
      query: queries.deleteAuthorMutation,
      variables: mocks.DeleteAuthor(),
    });

    const expected = mocks.AuthorsAfterDelete();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.deleteAuthor).toEqual(expected);

    console.log(
      "5-RESPONSE: ",
      response.body.singleResult.data?.deleteAuthor,
      "5-EXPECTED:",
      expected
    );
  });
});
