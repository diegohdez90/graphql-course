const user = {
  posts(parent, args, { db }, info) {
    return db.posts.filter(post => post.author === parent.id)
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => comment.user === parent.id)
  }
};

export { user as default };
