function memoizer(cb) {
  let cache = {};
  return function (...args) {
    if (cache[args]) {
      console.log("returning from cache for args:", args);
      return cache[args];
    } else {
      cache[args] = cb(...args);
      return cache[args];
    }
  };
}

const sum = (a, b) => a + b;

const memoizedSum = memoizer(sum);

console.log(memoizedSum(1, 2));
console.log(memoizedSum(3, 2));
console.log(memoizedSum(1, 2));
