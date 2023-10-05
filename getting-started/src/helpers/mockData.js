const users = [{
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

const posts = [{
  id: '1',
  title: 'Getting Stated with GraphQL',
  body: 'This is a sample tutorial in how to develop application with...',
  published: true,
  author: '1',
  comments: ['1','3','8','9']
}, {
  id: '2',
  title: 'React Hooks',
  body: 'The new feature in coding React application and develop functional components in JS and Typescript...',
  published: false,
  author: '2',
  comments: ['2','6']
}, {
  id: '3',
  title: 'Getting Stated with NodeJS',
  body: 'Runtime environment to develop JS applications...',
  published: true,
  author: '3',
  comments: ['4','5','7']
}, {
  id: '4',
  title: 'Python',
  body: 'Learn this OOP language...',
  published: true,
  author: '3',
  comments: ['10', '11', '12']
}]

const comments = [{
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

const db = {
  users,
  posts,
  comments
};

export { db as default }
