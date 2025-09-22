/*
A closure in JavaScript is a function that retains access to its outer function's variables even after 
the outer function has finished executing. This happens because JavaScript uses lexical scoping, 
meaning inner functions remember the scope in which they were created.
*/
function getMultiplier() {
    let prod = 1;
  function multiplier(num) {
    if (num) {
      prod *= num;
      return multiplier;
    } else {
      return prod;
    }
  }
  return multiplier;
}

const multiply = getMultiplier();
console.log(multiply(2)());
console.log(multiply(2)(3)());
console.log(multiply(2)(3)(4)(5)());

