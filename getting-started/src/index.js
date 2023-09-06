import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';

const dummyQuery = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

const dummyResolvers = {
  Query: {
    hello: () => 'First Query',
    name: () => 'My name is Diego',
    location: () => 'Puebla, Pue.',
    bio: () => `Frontend developer
      with experience in JavaScript.`
  }
};

const queryProduct = `
  type Query {
    id: ID
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`;

const resolversProduct = {
  Query: {
    id: () => '1234567890',
    title: () => 'Apple',
    price: () => 1.99,
    releaseYear: () => 1981,
    rating: () => 4.9,
    inStock: () => true
  }
}


createServer(
  createYoga({
    schema: createSchema({
      typeDefs: queryProduct,
      resolvers: resolversProduct
    })
  })
).listen(4000, () => {
  console.log('GraphQL running on port 4000');
});
