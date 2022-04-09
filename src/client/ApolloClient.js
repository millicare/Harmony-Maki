import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const mochiClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.mochiswap.io/subgraphs/name/mochiswap/mochiswap1",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});