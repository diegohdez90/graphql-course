import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { loadFiles } from '@graphql-tools/load-files';
import db from './helpers/mockData';

import Query from './resources/query';
import Mutation from './resources/mutation';
import User from './resources/user';
import Post from './resources/post';
import Comment from './resources/comment';

async function main() {
  const schema = createSchema({
    typeDefs: await loadFiles('src/schema.graphql'),
    resolvers: {
      Query,
      Mutation,
      Post,
      User,
      Comment
    },
  });
  const server = createServer(
    createYoga({
      schema: schema,
      context: {
        db: db
      },
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

