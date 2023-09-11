import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { users, posts } from './helpers/mockData';


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

const typeDefs = `
  type Query {
    greeting(name: String): String!
    add(a: Float, b: Float): Float!
    grades: [Int]!
    sumNumbers(numbers: [Int!]!): Int!
    me: User
    post: Post!
    users(query: String): [User]!
    posts(query: String): [Post]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`;

const resolvers = {
  Query: {
    me: () => ({
      id: '1234567890',
      name: 'Diego',
      email: 'diegohdez12@gmail.com'
    }),
    post: () => ({
      id: '1234567890',
      title: 'GraphQL Bootcamp',
      body: 'This is introduction in what is GraphQL',
      published: false
    }),
    greeting: function (parent, args, ctx, info) {
      if ('name' in args) return `Hi ${args.name}!`
      return 'Hello!';
    },
    add: function (parent, args, ctx, info) {
      var a = 1.0;
      var b = a;
      if (args.a) {
        a = parseFloat(args.a);
      }
      if(args.b) {
        b = parseFloat(args.b)
      }
      return a + b
    },
    grades: () => [9, 8, 10, 8, 9, 10, 10, 9],
    sumNumbers: function (parent, args, ctx, info) {
      return args.numbers.reduce((prev, curr) => {
        return prev + curr
      }, 0) || 0
    },
    users: function (parent, args, ctx, info) {
      if (!args.query) {
        return [...users];
      }
      return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts: function (parent, args, ctx, info) {
      if (!args.query) {
        return [...posts];
      }
      return posts.filter(post => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      const authorId = parent.author;
      return users.find(user => user.id === authorId);
    }
  }
}


createServer(
  createYoga({
    schema: createSchema({
      typeDefs: typeDefs,
      resolvers: resolvers
    })
  })
).listen(4000, () => {
  console.log('GraphQL running on port 4000');
});
