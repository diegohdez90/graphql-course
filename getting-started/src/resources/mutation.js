import { v4 as uuid } from 'uuid'

const mutation = {
  createUser(parent, args, { db }, info) {
    const existedEmail = db.users.some(user => user.email === args.email);
    if (existedEmail) {
      d
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
    if (!userExisted) {
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
  updatePost(parent, args, {db}, info) {
    const { input, id } = args;
    const post = db.posts.find(post => post.id === id);
    if (!post) {
      throw new Error('Post not found');
    }
    if (typeof input.title === 'string') {
      post.title = input.title;
    }

    if (typeof input.body === 'string') {
      post.body = input.body;
    }

    if (typeof input.published === 'boolean') {
      post.published = input.published;
    }

    return post;
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
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id)
    if (!user) {
      throw new Error('Unable to find user');
    }
    if (typeof data.email === 'string') {
      const taken = db.users.some(user => data.email === user.email)
      if (taken) {
        throw new Error('Unable to use this email')
      }
      user.email = data.email
    }

    if (typeof data.name === 'string') user.name = data.name;
    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    const index = db.users.findIndex(user => user.id === id)
    db.users[index] = user
    return user;
  },
  updateComment(parent, args, { db }, info) {
    const { id, input } = args;
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    if(typeof input.body === 'string') {
      comment.body = input.body;
    }
    return comment;
  }
};

export { mutation as default };
