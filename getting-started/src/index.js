import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';

createServer(
  createYoga({
    schema: createSchema({
      typeDefs: `
        type Query {
          hello: String!
          name: String!
          location: String!
          bio: String!
        }
      `,
      resolvers: {
        Query: {
          hello: () => 'First Query',
          name: () => 'My name is Diego',
          location: () => 'Puebla, Pue.',
          bio: () => `Frontend developer
            with experience in JavaScript.`
        }
      }
    })
  })
).listen(4000, () => {
  console.log('GraphQL running on port 4000');
});
