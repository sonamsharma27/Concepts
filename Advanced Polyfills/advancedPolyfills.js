Object.create = function (proto, propertiesObject) {
  // 1. Validate proto
  if (
    proto !== null &&
    typeof proto !== "object" &&
    typeof proto !== "function"
  ) {
    throw new TypeError("Object prototype may only be an Object or null");
  }

  // 2. Create new object with the given prototype
  //F is an empty constructor function.
  //Setting F.prototype = proto means that any instance of F will inherit from proto.
  //new F() creates a brand-new object.
  /**
   Every function in JavaScript automatically has a property called prototype (when the function is created).
   This prototype is an object.
   When you use a function as a constructor with new, the newly created object’s internal prototype ([[Prototype]], accessible via Object.getPrototypeOf(obj) or obj.__proto__) will point to that function’s prototype object.
   */
  function F() {}
  F.prototype = proto;
  const obj = new F();

  // 3. If propertiesObject is provided, define properties
  if (propertiesObject !== undefined) {
    if (propertiesObject !== Object(propertiesObject)) {
      //Object(propertiesObject) is a type coercion trick used to
      // check if propertiesObject is really an object.
      throw new TypeError("Properties must be an object");
    }
    Object.defineProperties(obj, propertiesObject);
  }

  return obj;
};

/**
 * Object.defineProperties is a built-in JavaScript method that lets you add
 * or modify multiple properties on an object at once, using property descriptors
 * to control how each property behaves.
 */

const animal = { eats: true };

const rabbit = Object.create(animal, {
  jumps: { value: true, enumerable: true },
});

console.log(rabbit.eats); // true (inherited)
console.log(rabbit.jumps); // true (own property)

let timeoutId = 0;
let timeoutMap = {};

function setTimeoutPolyfill(callback, delay) {
  let id = setInterval(() => {
    callback(); // ✅ Call the function
    clearInterval(id); // ✅ Clear interval after first call
  }, delay);

  return id;
}

function clearTimeoutPolyfill(id) {
  delete timeoutMap[id];
}

//setInterval

(function () {
  let intervalId = 0;
  const intervals = {};

  window.setIntervalPolyfill = function (callback, delay, ...args) {
    const id = ++intervalId;

    function repeat() {
      intervals[id] = setTimeout(() => {
        callback(...args);
        if (intervals[id]) {
          repeat(); // Schedule next execution
        }
      }, delay);
    }

    repeat();
    return id;
  };

  window.clearIntervalPolyfill = function (id) {
    clearTimeout(intervals[id]);
    delete intervals[id];
  };
})();


function instanceOfPolyfill(obj, constructor) {
  if (obj == null) return false;
  let prototype = constructor.prototype;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

function Animal() {}
let dog1 = new Animal();

console.log(instanceOfPolyfill(dog, Animal)); // true
console.log(instanceOfPolyfill({}, Animal)); // false

function newOperatorPolyfill(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return (typeof result === "object" && result !== null) ||
    typeof result === "function"
    ? result
    : obj;
}
// 🔍 How it works:
// Creates a new object with the desired prototype.
// Applies the constructor function on that object.
// Returns the result if it's an object or function; otherwise returns the newly created object.

function Person(name) {
  this.name = name;
}
const p1 = newOperatorPolyfill(Person, "Alice");
console.log(p.name); // Alice
console.log(p instanceof Person); // true

function Person(name) {
  this.name = name;
}
const p = newOperatorPolyfill(Person, "Alice");
console.log(p.name); // Alice
console.log(p instanceof Person); // true

// execute an array of promises in series (sequentially)
function runPromisesInSeries(tasks) {
  const results = [];
  return tasks
    .reduce((prevPromise, currTask) => {
      return prevPromise
        .then(() => currTask())
        .then((result) => {
          results.push(result);
        });
    }, Promise.resolve())
    .then(() => results);
}

function retryPromise(fn, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    function attempt(remaining) {
      fn()
        .then(resolve)
        .catch((err) => {
          if (remaining === 0) {
            reject(err);
          } else {
            setTimeout(() => attempt(remaining - 1), delay);
          }
        });
    }
    attempt(retries);
  });
}

//N async tasks in series -> tekion
// execute an array of promises in series (sequentially)
async function runInSeries(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task()); // Wait for each task to finish
  }
  return results;
}

// N async tasks in parallel
function runParallel(tasks, callback) {
  let results = [];
  let completed = 0;
  let hasError = false;

  tasks.forEach((task, index) => {
    task()
      .then((result) => {
        results[index] = result;
        completed++;

        if (completed === tasks.length && !hasError) {
          callback(null, results);
        }
      })
      .catch((err) => {
        if (!hasError) {
          hasError = true;
          callback(err);
        }
      });
  });
}

// or
async function runInParallel(tasks) {
  return Promise.all(tasks.map((task) => task()));
}

// Example usage:
const tasks = [
  () => new Promise((res) => setTimeout(() => res("Task 1 done"), 1000)),
  () => new Promise((res) => setTimeout(() => res("Task 2 done"), 500)),
  () => new Promise((res) => setTimeout(() => res("Task 3 done"), 1500)),
];

runParallel(tasks, (err, results) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("All tasks done:", results);
  }
});

// custom event emitter->tekion

class EventEmitter {
  constructor() {
    this.events = {}; // Stores eventName -> listeners[]
  }

  // Register a listener
  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  // Register a one-time listener
  once(eventName, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(eventName, onceWrapper);
    };
    this.on(eventName, onceWrapper);
  }

  // Remove a listener
  off(eventName, listener) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(
      (l) => l !== listener
    );
  }

  // Emit event (call all listeners)
  emit(eventName, ...args) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((listener) => listener(...args));
  }
}

const emitter = new EventEmitter();

function greet(name) {
  console.log(`Hello, ${name}!`);
}

emitter.on("greet", greet);
emitter.once("greet", (name) => console.log(`Nice to meet you, ${name}.`));

emitter.emit("greet", "Sonam");
// Hello, Sonam!
// Nice to meet you, Sonam.

emitter.emit("greet", "Sonam");
// Hello, Sonam!  (second listener removed after first run)

emitter.off("greet", greet);
emitter.emit("greet", "Sonam"); // nothing happens

function typeOf(value) {
  const rawType = Object.prototype.toString.call(value);
  const type = rawType.slice(8, -1).toLowerCase(); // Extract e.g., "[object Array]" → "array"
  return type;
}

function deepEqual(a, b) {
  // Same reference or primitive equality (handles NaN as well)
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;

  // Different types -> not equal
  if (typeof a !== typeof b) return false;

  // Handle Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  // If one is null or not an object -> false
  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  // Compare keys length
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  // Recursively compare all keys
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

function deepFreeze(obj) {
  // First freeze the current object
  Object.freeze(obj);

  // Then recursively freeze properties that are objects
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];
    if (
      value !== null &&
      typeof value === "object" &&
      !Object.isFrozen(value) // Avoid re-freezing
    ) {
      deepFreeze(value);
    }
  });

  return obj;
}

// Example
const person = {
  name: "John",
  address: {
    city: "New York",
    coords: { lat: 40.7, lng: -74.0 },
  },
};

deepFreeze(person);

person.name = "Jane"; // ❌ Won't work
person.address.city = "Boston"; // ❌ Won't work
person.address.coords.lat = 50; // ❌ Won't work

console.log(person);

function deepFreeze(obj, seen = new WeakSet()) {
  // Skip null or non-objects
  if (obj === null || typeof obj !== "object") return obj;

  // If we've already seen this object, skip to avoid infinite loops
  if (seen.has(obj)) return obj;
  seen.add(obj);

  // Freeze the current object
  Object.freeze(obj);

  // Recursively freeze properties
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];
    deepFreeze(value, seen);
  });

  return obj;
}

// Example with circular reference
const person = {
  name: "John",
  address: {
    city: "New York",
  },
};
person.self = person; // Circular reference

deepFreeze(person);

person.name = "Jane"; // ❌ Won't work
person.address.city = "Boston"; // ❌ Won't work
console.log(person);

JSON.stringify = function (value) {
  if (value === null) return "null";
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (typeof value === "string") return `"${value}"`;

  if (Array.isArray(value)) {
    return "[" + value.map((v) => JSON.stringify(v) || "null").join(",") + "]";
  }

  if (typeof value === "object") {
    const props = Object.keys(value)
      .map((key) => {
        const val = JSON.stringify(value[key]);
        return val !== undefined ? `"${key}":${val}` : undefined;
      })
      .filter(Boolean);
    return "{" + props.join(",") + "}";
  }

  return undefined; // functions, undefined, or symbols are skipped
};

/** todo:
custom react classNames library
JSON.parse
 */

/**
 * 
 * 1. prototype
  Who has it?
  Only functions (specifically, constructor functions) have the prototype property.

  What is it for?
  It’s the object that will be assigned as the [[Prototype]] (or __proto__) of any new object created by that function via new.

  When is it used?
  At object creation time — JavaScript uses it to set up the new object's prototype chain.

  function Person() {}
  console.log(Person.prototype); // default: { constructor: Person }
  const p = new Person();

  2. __proto_
  Who has it?
  Every object (including functions, since functions are objects too) has __proto__.

  What is it for?
  It points to the actual internal prototype ([[Prototype]]) of the object, which is used for property lookup in the prototype chain.

  When is it used?
  At runtime — when accessing a property, JS looks at the object; if not found, it follows __proto__ up the chain.

  Example:
  const obj = {};
  console.log(obj.__proto__ === Object.prototype); // true

  In short:
  prototype → a property on functions, used as a blueprint for new objects.
  __proto__ → a property on all objects, pointing to the blueprint they were created from.


| Feature                                            | Spread (`...`)  | `Object.defineProperties(with`getOwnPropertyDescriptors`) |
| Preserves `writable`, `configurable`, `enumerable` | ❌ No           | ✅ Yes                                                        |
| Copies non-enumerable properties                   | ❌ No           | ✅ Yes                                                        |
| Preserves getter/setter functions                  | ❌ No           | ✅ Yes                                                        |


const src = {};
Object.defineProperty(src, "hidden", {
  value: 42,
  enumerable: false // won't show up in loops/spread
});

const spreadCopy = { ...src };
console.log(spreadCopy.hidden); // undefined (skipped)

const descriptorCopy = {};
Object.defineProperties(descriptorCopy, Object.getOwnPropertyDescriptors(src));
console.log(descriptorCopy.hidden); // 42 (preserved)

const src = {
  get value() {
    console.log("Getter called");
    return Math.random();
  }
};

const spreadCopy = { ...src }; 
console.log(spreadCopy.value); // Getter called once, now fixed number

const descriptorCopy = {};
Object.defineProperties(descriptorCopy, Object.getOwnPropertyDescriptors(src));
console.log(descriptorCopy.value); // Getter called every time
console.log(descriptorCopy.value); // Different number

 */


