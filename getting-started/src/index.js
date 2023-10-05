import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { loadFiles } from '@graphql-tools/load-files';
import db from './helpers/mockData';

import query from './resources/query';
import mutation from './resources/mutation';
import user from './resources/user';
import post from './resources/post';
import comment from './resources/comment';

async function main(params) {
  const schema = createSchema({
    typeDefs: await loadFiles('src/schema.graphql'),
    resolvers: {
      Query: query,
      Mutation: mutation,
      User: user,
      Comment: comment,
      Post: post
    },
    context: {
      db
    }
  });
  const server = createServer(
    createYoga({
      schema: schema
    })
  )
  
  server.listen(4000, () => {
    console.log('GraphQL running on port 4000');
  });
}

main().catch(e => {
  console.error(e)
  process.exit();
})

