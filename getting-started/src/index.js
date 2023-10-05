import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { v4 as uuid } from 'uuid'

var users = [{
  id: '1',
  name: 'Diego',
  email: 'diegohdez12@gmail.com'
}, {
  id: '2',
  name: 'John',
  email: 'johndoe@gmail.com'
}, {
  id: '3',
  name: 'Juan',
  email: 'juanperez@gmail.com'
}, {
  id: '4',
  name: 'Richard',
  email: 'richard@gmail.com'
}, {
  id: '5',
  name: 'Edward',
  email: 'edward@gmail.com'
}, {
  id: '6',
  name: 'Marian',
  email: 'marian@gmail.com'
}, {
  id: '7',
  name: 'Jessica',
  email: 'jessica@gmail.com'
}, {
  id: '8',
  name: 'Mario',
  email: 'mario@gmail.com'
}];

var posts = [{
  id: '1',
  title: 'Getting Stated with GraphQL',
  body: 'This is a sample tutorial in how to develop application with...',
  published: true,
  author: '1',
  comments: ['1', '3', '8', '9']
}, {
  id: '2',
  title: 'React Hooks',
  body: 'The new feature in coding React application and develop functional components in JS and Typescript...',
  published: false,
  author: '2',
  comments: ['2', '6']
}, {
  id: '3',
  title: 'Getting Stated with NodeJS',
  body: 'Runtime environment to develop JS applications...',
  published: true,
  author: '3',
  comments: ['4', '5', '7']
}, {
  id: '4',
  title: 'Python',
  body: 'Learn this OOP language...',
  published: true,
  author: '3',
  comments: ['10', '11', '12']
}]

var comments = [{
  id: '1',
  body: 'Now, I understand how GraphQL works',
  user: '4'
}, {
  id: '2',
  body: 'Good upgrade in React. This will be easy to code',
  user: '5'
}, {
  id: '3',
  body: 'Easy for dummy, thanks.',
  user: '6'
}, {
  id: '4',
  body: 'I love the introduction. A very useful manual for developers',
  user: '7'
}, {
  id: '5',
  body: 'Detailed explanation to understand',
  user: '8'
}, {
  id: '6',
  body: 'Easy to understand and code. Thanks for sharing',
  user: '6'
}, {
  id: '7',
  body: 'The samples explained line per line. I will study for my nex exam',
  user: '4'
}, {
  id: '8',
  body: 'This is a good tutorial. I\'d like this was published 3 years ago',
  user: '5'
}, {
  id: '9',
  body: 'I will share this with my colleagues',
  user: '7'
}, {
  id: '10',
  body: 'Interested',
  user: '1'
}, {
  id: '11',
  body: 'I undestood from the beginning',
  user: '2'
}, {
  id: '12',
  body: 'Excellent tutorial',
  user: '3'
}]


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
    },
    comments: function() {
      return [...comments];
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const existedEmail = users.some(user => user.email === args.email);
      if (existedEmail) {d
        throw new Error('Email already existed')
      }
      const body = new Object(args.input);
      const id = uuid()
      const input = {
        id: id,
        ...body
      }
      users.push(input)
      return input;
    },
    createPost(parent, args, ctx, info) {
      const userExisted = users.find(user => user.id === args.input.author)
      if(!userExisted) {
        throw new Error('User does not exists');
      }
      const id = uuid();
      const post = {
        ...args.input,
        id: id,
        comments: [],
      }
      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const postExisted = posts.find(post => post.id === args.input.post);
      
      const userExisted = users.find(user => user.id === args.input.user);
      if (!postExisted || !userExisted) {
        throw new Error("User or Post info cannot be retrieved, please review your input data");
      }

      const id = uuid()
      const comment = {
        id,
        ...args.input
      };

      postExisted.comments = [...postExisted.comments, comment.id];
      comments.push(comment);

      return comment;
    },
    deleteUser(parent, args, ctx, info) {
      const { id } = args
      const index = users.findIndex(user => user.id === id);

      if (index === -1) {
        throw new Error("User not found");
      }

      const [userDeleted] = users.splice(index, 1);
      posts = posts.map(post => {
        post = post.comments.filter(comment => comment !== id)
        return post;
      });
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
      const { id } = args;
      const indexPost = posts.findIndex(post => post.id === id);
      if (indexPost === -1) {
        throw new Error('Post not found')
      }

      const [postDeleted] = posts.splice(indexPost, 1);

      comments = comments.filter(comment => !postDeleted.comments.includes(comment.id));
      //  comments = comments.filter(comment => comment.post !== id)

      return postDeleted;
    },
    deleteComment(parent, args, ctx, info) {
      const { id } = args;

      const index = comments.findIndex(comment => 
        comment.id === id
      );

      if (index === -1) {
        throw new Error('Comment not found')
      }

      const [commentDeleted] = comments.splice(index, 1);

      for (let indexPost = 0; indexPost < posts.length; indexPost++) {
        const innerComments = posts[indexPost].comments;
        const cIndex = innerComments.findIndex(ic => ic === id);
        if (cIndex !== -1) {
          innerComments.splice(cIndex, 1);
          posts[indexPost].comments = innerComments;
        }
      }

      return commentDeleted;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      const authorId = parent.author;
      return users.find(user => user.id === authorId);
    },
    comments(parent, args, ctx, info) {
      const commentsIds = parent.comments
      return commentsIds.map(id => comments.find(comment => comment.id === id));
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.user === parent.id)
    }
  },
  Comment: {
    user(parent, args, ctx, info) {
      return users.find(user => user.id === parent.user)
    },
    post(parent, args, ctx, info) {
      for (let index = 0; index < posts.length; index++) {
        const comment = posts[index].comments.find(innerComment =>
          innerComment === parent.id
        )
        if (comment)
          return posts[index];
      }
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
