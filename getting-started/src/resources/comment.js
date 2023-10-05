const comment = {
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
};

export { comment as default };
