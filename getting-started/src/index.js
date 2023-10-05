import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid'
import db from './helpers/mockData.js';


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
    users: function (parent, args, { db }, info) {
      if (!args.query) {
        return [...db.users];
      }
      return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts: function (parent, args, { db }, info) {
      if (!args.query) {
        return [...db.posts];
      }
      return db.posts.filter(post => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
    },
    comments: function(parent, args, { db }, info) {
      return [...db.comments];
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const existedEmail = db.users.some(user => user.email === args.email);
      if (existedEmail) {d
        throw new Error('Email already existed')
      }
      const body = new Object(args.input);
      const id = uuid()
      const input = {
        id: id,
        ...body
      }
      db.users.push(input)
      return input;
    },
    createPost(parent, args, { db }, info) {
      const userExisted = db.users.find(user => user.id === args.input.author)
      if(!userExisted) {
        throw new Error('User does not exists');
      }
      const id = uuid();
      const post = {
        ...args.input,
        id: id,
        comments: [],
      }
      db.posts.push(post);
      return post;
    },
    createComment(parent, args, { db }, info) {
      const postExisted = db.posts.find(post => post.id === args.input.post);
      
      const userExisted = db.users.find(user => user.id === args.input.user);
      if (!postExisted || !userExisted) {
        throw new Error("User or Post info cannot be retrieved, please review your input data");
      }

      const id = uuid()
      const comment = {
        id,
        ...args.input
      };

      postExisted.comments = [...postExisted.comments, comment.id];
      db.comments.push(comment);

      return comment;
    },
    deleteUser(parent, args, { db }, info) {
      const { id } = args
      const index = db.users.findIndex(user => user.id === id);

      if (index === -1) {
        throw new Error("User not found");
      }

      const [userDeleted] = db.users.splice(index, 1);
      // posts = posts.map(post => {
      //   post = post.comments.filter(comment => comment !== id)
      //   return post;
      // });
      db.posts = db.posts.filter(post => {
        const matched = post.author === id
        if (matched) {
          db.comments.filter(comment => comment.post !== post.id)
        }
        return !matched
      });
      db.comments = db.comments.filter(comment => comment.user !== id);

      return userDeleted;
    },
    deletePost(parent, args, { db }, info) {
      const { id } = args;
      const indexPost = db.posts.findIndex(post => post.id === id);
      if (indexPost === -1) {
        throw new Error('Post not found')
      }

      const [postDeleted] = db.posts.splice(indexPost, 1);

      db.comments = db.comments.filter(comment => !postDeleted.comments.includes(comment.id));
      //  comments = comments.filter(comment => comment.post !== id)

      return postDeleted;
    },
    deleteComment(parent, args, { db }, info) {
      const { id } = args;

      const index = db.comments.findIndex(comment => 
        comment.id === id
      );

      if (index === -1) {
        throw new Error('Comment not found')
      }

      const [commentDeleted] = db.comments.splice(index, 1);

      for (let indexPost = 0; indexPost < db.posts.length; indexPost++) {
        const innerComments = db.posts[indexPost].comments;
        const cIndex = innerComments.findIndex(ic => ic === id);
        if (cIndex !== -1) {
          innerComments.splice(cIndex, 1);
          db.posts[indexPost].comments = innerComments;
        }
      }

      return commentDeleted;
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      const authorId = parent.author;
      return db.users.find(user => user.id === authorId);
    },
    comments(parent, args, { db }, info) {
      const commentsIds = parent.comments
      return commentsIds.map(id => db.comments.find(comment => comment.id === id));
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.user === parent.id)
    }
  },
  Comment: {
    user(parent, args, { db }, info) {
      return db.users.find(user => user.id === parent.user)
    },
    post(parent, args, { db }, info) {
      for (let index = 0; index < db.posts.length; index++) {
        const comment = db.posts[index].comments.find(innerComment =>
          innerComment === parent.id
        )
        if (comment)
          return db.posts[index];
      }
    }
  }
}


createServer(
  createYoga({
    schema: createSchema({
      typeDefs: fs.readFileSync(
        path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.graphql'),
        'utf-8'
      ),
      resolvers: resolvers,
      context: {
        db
      }
    })
  })
).listen(4000, () => {
  console.log('GraphQL running on port 4000');
});
