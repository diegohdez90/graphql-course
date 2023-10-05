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
};

export { mutation as default };
