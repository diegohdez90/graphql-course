const query = {
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
    if (args.b) {
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
  comments: function (parent, args, { db }, info) {
    return [...db.comments];
  }
};

export { query as default };
