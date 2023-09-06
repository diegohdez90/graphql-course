import id, { greeting, location, message, myName } from "./module";
import add, { substract } from './mathematics';


console.log(message, myName, location, id);
console.log(greeting())

console.log(add(5,8));
console.log(substract(10,7));