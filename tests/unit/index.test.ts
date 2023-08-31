import { ApolloServer } from "@apollo/server";
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
};

describe("Unit test for fetching books", function () {
  test("returns list of books", async () => {
    const testServer = new ApolloServer({
      schema: addMocksToSchema({
        schema: makeExecutableSchema({ typeDefs, resolvers }),
        mocks,
        preserveResolvers: true,
      }),
    });

    const response = await testServer.executeOperation({
      query: "query Books { books { id title } }",
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
});

describe("Unit test for add book", function () {
  test("returns the added book", async () => {
    const testServer = new ApolloServer({
      schema: addMocksToSchema({
        schema: makeExecutableSchema({ typeDefs, resolvers }),
        mocks,
        preserveResolvers: true,
      }),
    });

    const response = await testServer.executeOperation({
      query:
        "mutation AddBook($book:AddBookInput!) { addBook(book:$book) { id title } }",
      variables: mocks.AddBookInput(),
    });

    const expected = mocks.AddedBook();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.addBook).toEqual(expected);

    console.log(
      "2-RESPONSE: ",
      response.body.singleResult.data?.addBook,
      "2-EXPECTED:",
      expected
    );
  });
});

describe("Unit test for update book", function () {
  test("returns the updated book", async () => {
    const testServer = new ApolloServer({
      schema: addMocksToSchema({
        schema: makeExecutableSchema({ typeDefs, resolvers }),
        mocks,
        preserveResolvers: true,
      }),
    });

    const response = await testServer.executeOperation({
      query:
        "mutation UpdateBook($id:ID!, $edits:UpdateBookInput!) { updateBook(id:$id, edits:$edits) { id title author { id } } }",
      variables: mocks.UpdateBookInput(),
    });

    const expected = mocks.UpdatedBook();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.updateBook).toEqual(expected);

    console.log(
      "3-RESPONSE: ",
      response.body.singleResult.data?.updateBook,
      "3-EXPECTED:",
      expected
    );
  });
});

describe("Unit test for delete book", function () {
  test("returns the list of books except the deleted one", async () => {
    const testServer = new ApolloServer({
      schema: addMocksToSchema({
        schema: makeExecutableSchema({ typeDefs, resolvers }),
        mocks,
        preserveResolvers: true,
      }),
    });

    const response = await testServer.executeOperation({
      query: "mutation DeleteBook($id:ID!) { deleteBook(id:$id) { id title } }",
      variables: mocks.DeleteBook(),
    });

    const expected = mocks.BooksAfterDelete();

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.deleteBook).toEqual(expected);

    console.log(
      "3-RESPONSE: ",
      response.body.singleResult.data?.deleteBook,
      "3-EXPECTED:",
      expected
    );
  });
});
