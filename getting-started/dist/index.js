"use strict";

var _http = require("http");
var _graphqlYoga = require("graphql-yoga");
var _uuid = require("uuid");
var _mockData = require("./helpers/mockData");
var dummyQuery = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;
var dummyResolvers = {
  Query: {
    hello: () => 'First Query',
    name: () => 'My name is Diego',
    location: () => 'Puebla, Pue.',
    bio: () => `Frontend developer
      with experience in JavaScript.`
  }
};
var typeDefs = `
  type Query {
    greeting(name: String): String!
    add(a: Float, b: Float): Float!
    grades: [Int]!
    sumNumbers(numbers: [Int!]!): Int!
    me: User
    post: Post!
    users(query: String): [User]!
    posts(query: String): [Post]!
    comments: [Comment]!
  }

  type Mutation {
    createUser(input: CreateUserInput): User!
    createPost(input: CreatePostInput): Post!
    createComment(input: CreateCommentInput): Comment!
    deleteUser(id: ID!): User!
    deletePost(id: ID!): Post!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    body: String!
    post: ID!
    user: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    body: String!
    user: User
    post: Post!
  }
`;
var resolvers = {
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
      if ('name' in args) return `Hi ${args.name}!`;
      return 'Hello!';
    },
    add: function (parent, args, ctx, info) {
      var a = 1.0;
      var b = a;
      if (args.a) {
        a = parseFloat(args.a);
      }
      if (args.b) {
        b = parseFloat(args.b);
      }
      return a + b;
    },
    grades: () => [9, 8, 10, 8, 9, 10, 10, 9],
    sumNumbers: function (parent, args, ctx, info) {
      return args.numbers.reduce((prev, curr) => {
        return prev + curr;
      }, 0) || 0;
    },
    users: function (parent, args, ctx, info) {
      if (!args.query) {
        return [..._mockData.users];
      }
      return _mockData.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
    },
    posts: function (parent, args, ctx, info) {
      if (!args.query) {
        return [..._mockData.posts];
      }
      return _mockData.posts.filter(post => post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()));
    },
    comments: function () {
      return [..._mockData.comments];
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      var existedEmail = _mockData.users.some(user => user.email === args.email);
      if (existedEmail) {
        d;
        throw new Error('Email already existed');
      }
      var body = new Object(args.input);
      var id = (0, _uuid.v4)();
      var input = {
        id: id,
        ...body
      };
      _mockData.users.push(input);
      return input;
    },
    createPost(parent, args, ctx, info) {
      var userExisted = _mockData.users.find(user => user.id === args.input.author);
      if (!userExisted) {
        throw new Error('User does not exists');
      }
      var id = (0, _uuid.v4)();
      var post = {
        ...args.input,
        id: id,
        comments: []
      };
      _mockData.posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      var postExisted = _mockData.posts.find(post => post.id === args.input.post);
      var userExisted = _mockData.users.find(user => user.id === args.input.user);
      if (!postExisted || !userExisted) {
        throw new Error("User or Post info cannot be retrieved, please review your input data");
      }
      var id = (0, _uuid.v4)();
      var comment = {
        id,
        ...args.input
      };
      postExisted.comments = [...postExisted.comments, comment.id];
      _mockData.comments.push(comment);
      return comment;
    },
    deleteUser(parent, args, ctx, info) {
      var {
        id
      } = args;
      var index = _mockData.users.findIndex(user => user.id === id);
      if (index === -1) {
        throw new Error("User not found");
      }
      var [userDeleted] = _mockData.users.splice(index, 1);
      _mockData.posts = (_mockData.posts.map(post => {
        post = post.comments.filter(comment => comment !== id);
        return post;
      }), function () {
        throw new Error('"' + "posts" + '" is read-only.');
      }());
      /**posts = posts.filter(post => {
        const matched = post.author === id
        if (matched) {
          comments.filter(comment => comment.post !== post.id)
        }
        return !matched
      });
      comments = comments.filter(comment => comment.user !== id);*/

      return userDeleted;
    },
    deletePost(parent, args, ctx, info) {
      var {
        id
      } = args;
      var indexPost = _mockData.posts.findIndex(post => post.id === id);
      if (indexPost === -1) {
        throw new Error('Post not found');
      }
      var [postDeleted] = _mockData.posts.splice(indexPost, 1);
      _mockData.comments = (_mockData.comments.filter(comment => !postDeleted.comments.includes(comment.id)), function () {
        throw new Error('"' + "comments" + '" is read-only.');
      }());
      return postDeleted;
    },
    deleteComment(parent, args, ctx, info) {
      var {
        id
      } = args;
      console.log(args);
      var index = _mockData.comments.findIndex(comment => comment.id === id);
      console.log('index', index);
      if (index === -1) {
        throw new Error('Comment not found');
      }
      var [commentDeleted] = _mockData.comments.splice(index, 1);
      console.log(commentDeleted);
      for (var indexPost = 0; indexPost < _mockData.posts.length; indexPost++) {
        var innerComments = _mockData.posts[indexPost].comments;
        var cIndex = innerComments.findIndex(ic => ic === id);
        if (cIndex !== -1) {
          innerComments.splice(cIndex, 1);
          _mockData.posts[indexPost].comments = innerComments;
        }
      }
      return commentDeleted;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      var authorId = parent.author;
      return _mockData.users.find(user => user.id === authorId);
    },
    comments(parent, args, ctx, info) {
      var commentsIds = parent.comments;
      return commentsIds.map(id => _mockData.comments.find(comment => comment.id === id));
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return _mockData.posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return _mockData.comments.filter(comment => comment.user === parent.id);
    }
  },
  Comment: {
    user(parent, args, ctx, info) {
      return _mockData.users.find(user => user.id === parent.user);
    },
    post(parent, args, ctx, info) {
      for (var index = 0; index < _mockData.posts.length; index++) {
        var comment = _mockData.posts[index].comments.find(innerComment => innerComment === parent.id);
        if (comment) return _mockData.posts[index];
      }
    }
  }
};
(0, _http.createServer)((0, _graphqlYoga.createYoga)({
  schema: (0, _graphqlYoga.createSchema)({
    typeDefs: typeDefs,
    resolvers: resolvers
  })
})).listen(4000, () => {
  console.log('GraphQL running on port 4000');
});