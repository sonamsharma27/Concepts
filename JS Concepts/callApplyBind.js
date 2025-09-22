const obj1 = {
  name: "Sonam",
  printName: function (state, country) {
    console.log(this.name + " from " + state + " in " + country);
  },
};

const obj2 = {
  name: "Sonam",
};
const obj3 = {
  name: "Akshu",
};

const printNameFunction = function () {
  console.log(this.name);
};

const printName = function (name) {
  console.log(name);
};

obj1.printName.call(obj2, "J&K", "India"); // Calls a method of an object, substituting another object for the current object.
// //1st argument acts as a substitue for the object. Acts as this object. Remaining arguments are params to the function being called

obj1.printName.apply(obj2, ["J&K", "India"]); //Calls the function, substituting the specified object for the this value of the function,
//and the specified array for the arguments of the function.

const logForAkshu = obj1.printName.bind(obj3);
const logForSonam = printNameFunction.bind(obj3);
const logForArg = printName.bind();

obj1.printName("J&K", "India");
logForArg("Argument");
logForSonam();


Function.prototype.myBind = function (obj, ...args) {
  const fn = this;

  return function boundFn(...innerArgs) {
    // If called with `new`, use the new instance as `this`
    if (this instanceof boundFn) {
      return new fn(...args, ...innerArgs);
    }
    return fn.apply(obj, [...args, ...innerArgs]);
  };
};

function Person(name) {
  this.name = name;
}

const obj = { name: "BoundName" };

const BoundPerson = Person.myBind(obj);

const p = new BoundPerson("ActualName");

console.log(p.name);       // ✅ "ActualName"
console.log(p instanceof Person); // ✅ true


// if (this instanceof boundFn)
// ensures that if the bound function is called with new, the new object created by the constructor will be used as this, not the one passed to myBind.


Function.prototype.myCall = function (obj = {}, ...args) {
  obj = obj || globalThis; // fallback for null/undefined
  const fnSymbol = Symbol(); // avoid overwriting existing properties
  obj[fnSymbol] = this;
  const result = obj[fnSymbol](...args);
  delete obj[fnSymbol]; // clean up
  return result;
};
