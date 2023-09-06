const message = 'Message from module.js';
const myName = 'Diego';
const location = 'Puebla de Zaragoza';
const id = 'HRNNDZDG'

const greeting = () => {
  return `My name is ${myName} and I am enrolled in the GraphQL bootcamp`
}


export {
  message,
  myName,
  location,
  greeting,
  id as default
};
