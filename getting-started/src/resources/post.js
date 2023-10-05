const post = {
  author(parent, args, { db }, info) {
    const authorId = parent.author;
    return db.users.find(user => user.id === authorId);
  },
  comments(parent, args, { db }, info) {
    const commentsIds = parent.comments
    return commentsIds.map(id => db.comments.find(comment => comment.id === id));
  }
}

export { post as default};
