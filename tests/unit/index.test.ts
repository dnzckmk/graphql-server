import { ApolloServer } from "@apollo/server";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../../src/schema";
import { resolvers } from "../../src/resolvers";
import { expect, describe, it } from "@jest/globals";
import assert from "node:assert";

const mocks = {
  Book: () => ({
    title: "To Kill a Mocking Bird",
  }),
  Author: () => ({
    firstName: "Harper",
    lastName: "Lee",
    verified: true,
  }),
};

describe("Unit test for add book", function () {
  it("returns list of books", async () => {
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

    const expected = [
      { id: "1", title: "The Awakening" },
      { id: "2", title: "City of Glass" },
    ];

    // Note the use of Node's assert rather than Jest's expect; if using
    // TypeScript, `assert`` will appropriately narrow the type of `body`
    // and `expect` will not.
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.books).toEqual(expected);
  });
});
