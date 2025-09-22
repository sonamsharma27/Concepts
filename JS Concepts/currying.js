/*
Currying in JavaScript is a technique in functional programming where a function is transformed into 
a sequence of functions, each taking a single argument. Instead of passing all arguments at once, the 
function takes them one at a time and returns a new function until all arguments are provided.
*/

function multiply(a, b) {
  console.log(a * b);
}
// function multiply(a) {    
//   return function multiply_a(b) {
//     return function multiply_ab(c) {
//       console.log(a * b * c);
//     };
//   };
// }

// const multiplyBy2 = multiply(2);
// const multiplyBy10 = multiplyBy2(5);
// multiplyBy10(25);

// multiply(2)(8)(5);

function logInfo(a, b) {
  console.log(a + " " + b);
}

// this is currying
const multiplyBy2 = multiply.bind(this, 2);
const logSharma = logInfo.bind(this, "Sharma"); //the passed argument takes place of first param

multiplyBy2(5);
logSharma("Sonam");

