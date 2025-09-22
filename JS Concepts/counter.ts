const getCounter = () => {
    let count = 0;

    const counter = () => {
        count++;
        console.log(count);
    }
    return counter;
}

const counter = getCounter();

// A constructor function in JavaScript is just a regular function that is:
// Invoked with the new keyword.
// Designed to initialize and return an object.
// CounterWithConstructorFunction is a function. When you call it with new Counter(), it behaves like a constructor by:
// Creating a new object (this).
// this refers to the new object being created.
// Attaching increment and decrement methods to that object.
// Returning that object implicitly.

function CounterWithConstructorFunction() {
    let count = 0;
    this.increment = function () {
        count++;
        console.log(count);
    };
    this.decrement = function () {
        count--;
        console.log(count);
    }
}

// let smartCounter = new CounterWithConstructorFunction();
// smartCounter.increment();
// smartCounter.decrement();
// smartCounter.decrement();
// smartCounter.increment();

function Counter() {
    let count = 0;
    return {
        increment: function () {
            count++;
            console.log(count);
        },
        decrement: function () {
            count--;
            console.log(count);
        }
    }
}

let objCounter = Counter();
objCounter.decrement();
objCounter.increment();
objCounter.increment();
objCounter.increment();

// A pure function in JavaScript (or any programming language) is a function that:
// Always returns the same output for the same input.
// Has no side effects.

// No Side Effects:
// It doesn’t modify variables outside its scope.
// It doesn’t change the input or rely on external states (like database queries, API calls, or DOM manipulation).
// Why Use Pure Functions?
// Predictability: Easier to debug and test.
// Reusability: Can be used without worrying about unintended consequences.
// Concurrency: Safe to run in parallel (no shared state).
// Caching & Memoization: Results can be cached since they always return the same output.


function add(a, b) {
  return a + b;
}
add(2, 3); // ➝ 5

function curriedAdd(a) {
  return function(b) {
    return a + b;
  };
}
curriedAdd(2)(3); // ➝ 5