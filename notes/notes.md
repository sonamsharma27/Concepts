# notes

for of loop is used on arrays, maps, sets
for in loop is used for keys (of objects)


Ways to center a div
1. Margin auto for block elements
2. Using absolute positioning with transform
3. Flexbox 
4. Grid


Capturing happens first, then goes to bubbling up.

Bubbling up is default when adding event listeners

To enable Capturing, add {capture: true} in addEventListener as param

default method is bubbling up

 clickedPage.scrollIntoView({
      behavior: "smooth",
      block: "nearest", //vertical alignment
      inline: "center", //horizontal alignment
```js
    });
```


Promises -> microtask queue
setTimeout -> macrotask queue


### How does a function "remember" variables from its outer scope?
Because it keeps a reference to its lexical environment, not a copy. So even if the outer function finishes, the inner function still has access.

```js
for (var i = 0; i < 3; i++) {
  (function(i) {
    setTimeout(() => console.log(i), 0);
  })(i);
}
// Outputs: 0 1 2
```

```js
var is function-scoped and hoisted
```

```js
let and const are block-scoped
```

Inside loops, let creates a new binding per iteration, preventing common closure issues

```js
const person = {
  name: "Alex",
  getName: function () {
    return this.name;
  },
};
const get = person.getName;
console.log(get());              // undefined
console.log(person.getName());  // Alex
```

```js
var x = 10;
function test() {
  console.log(x);
  var x = 5;
}
```

test(); // undefined

|| considers falsy values (0, "", etc.)
?? only considers null and undefined.


```js
const a = {};
const b = { key: "b" };
const c = { key: "c" };
```

```js
a[b] = 123;
a[c] = 456;
```

```js
console.log(a[b]);
```

## ✅ Output:
456 // Reason: Object keys are coerced to strings. b and c become "[object Object]", so the second assignment overwrites the first.


​In programming, a thunk is a function that encapsulates a computation, delaying its execution until it's explicitly invoked. This concept is particularly useful for managing side effects, implementing lazy evaluation, or handling asynchronous operations.
A thunk is essentially a wrapper function that postpones the evaluation of an expression. Instead of computing a value immediately, you define a function (the thunk) that performs the computation when called

```js
// Immediate execution
const result = computeExpensiveValue();
```

```js
// Deferred execution using a thunk
const thunk = () => computeExpensiveValue();
```

In functional programming, thunks are used to implement lazy evaluation, where expressions are not evaluated until their values are needed. This approach can improve performance by avoiding unnecessary calculations


⚙️ Thunks in Redux
In the context of Redux, a thunk is a function that returns another function. This returned function can perform asynchronous operations and dispatch actions based on the outcomes. To handle such functions, Redux uses middleware like redux-thunk.​


e.preventDefault() is used in JavaScript to stop the browser’s default behavior for a specific event.
like preventing reloading of page after form submit


✅ 1. Using dataset API (recommended)
```js
const element = document.getElementById("myDiv");
element.dataset.userId = "12345";
```

## This sets:

```html
<div id="myDiv" data-user-id="12345"></div>
```

JavaScript automatically converts data-user-id to dataset.userId (camelCase).

✅ 2. Using setAttribute()
```js
const element = document.getElementById("myDiv");
element.setAttribute("data-user-id", "12345");
```

## 🔍 Reading the value:
```js
console.log(element.dataset.userId);       // "12345"
console.log(element.getAttribute("data-user-id"));  // "12345"
```


```js
array.sort((a, b) => {
  return a - b;
});
```

Return Value	                Sorting Order
< 0 (negative)	              a comes before b
0	                            a and b remain unchanged
> 0 (positive)	              b comes before a


Every object can inherit from another object using Object.create() or constructors.

```js
// Parent constructor
function Animal(name) {
  this.name = name;
}
```

Animal.prototype.speak = function () {
```js
  console.log(this.name + " makes a noise.");
};
```

```js
// Child constructor
function Dog(name, breed) {
  Animal.call(this, name); // inherit name from Animal
  this.breed = breed;      // add breed
}
```

```js
// Set up inheritance chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

```js
// Override or add methods
```

Dog.prototype.speak = function () {
```js
  console.log(this.name + " barks. Breed: " + this.breed);
};
```

```js
// Test it
const dog = new Dog("Rex", "Labrador");
```

dog.speak(); // Rex barks. Breed: Labrador


The DOM is a tree-like structure representing the content of a web page.
JavaScript can use the DOM to select, change, add, or remove elements.

✅ What is a Prototype in JavaScript?
In JavaScript, every object has a hidden internal property called [[Prototype]], which is usually accessible via __proto__. This is how JavaScript supports inheritance — not by copying, but by linking objects together.


## When you try to access a property or method on an object:

JavaScript first checks if the property exists on the object itself.

If not, it looks up the prototype chain — the object’s prototype.

If it still doesn't find it, it moves up again, until it reaches null.

🔄 Full Lifecycle Order
## Mounting:
constructor → getDerivedStateFromProps → render → componentDidMount

## Updating (via setState):
getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate

## Unmounting:
componentWillUnmount


Promise.all() order is maintained. Time of resolution doesn't matter
The then() method takes up to two arguments; the first argument is a callback function for the fulfilled case of the promise, and the second argument is a callback function for the rejected case.


## Client Side Rendering:

Markup rendered by JavaScript sidesteps(skips) the preload scanner, as the resources contained within the client-rendered markup are not discoverable by it. This could delay the download of crucial resources, such as an LCP image. The browser only begins downloading the LCP image after the script has executed, and added the element to the DOM. In turn, the script can only be executed after it has been discovered, downloaded, and parsed. This is known as a critical request chain and should be avoided. 


The event loop in JavaScript is the core mechanism that allows asynchronous operations (like setTimeout, Promises, fetch, etc.) to work seamlessly in a single-threaded environment.


🔁 What is the Event Loop?
JavaScript runs on a single thread — meaning it can only do one thing at a time. The event loop manages the execution of synchronous and asynchronous code by using different queues and the call stack.

## Basic Workflow:
Call Stack: Executes synchronous code line-by-line.

Web APIs (Browser APIs): Handles async tasks (e.g., timers, DOM events, fetch).

## Task Queues:
Microtask Queue (a.k.a. Job Queue)
Macrotask Queue (a.k.a. Task Queue or Callback Queue)

## Event Loop:
When the call stack is empty, the event loop pushes tasks from queues to the call stack.
Microtasks are prioritized over macrotasks.

📦 Microtask Queue
## Includes:
.then, .catch, .finally (from Promises)
queueMicrotask
MutationObserver

## Characteristics:
Executed immediately after the current operation completes and before any macrotask.
If new microtasks are added while processing the queue, they’re added to the same cycle.


Macrotask Queue
## Includes:
setTimeout
setInterval
setImmediate (Node.js)
requestAnimationFrame

## Characteristics:
Executed after the microtask queue is emptied.
Each macrotask executes one at a time per loop iteration.


Inline styles are part of the DOM, not the CSSOM.
