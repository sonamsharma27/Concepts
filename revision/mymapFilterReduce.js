let a = [1, 2, 3, 4, 5];

const b = a.map((e) => e + 1);

const obj = {
  A: a,
};

Array.prototype.myMap = function (cb) {
  let mappedArray = [];
  for (let i = 0; i < this.length; i++) {
    mappedArray.push(cb(this[i]));
  }
  return mappedArray;
};

Array.prototype.myFilter = function (cb) {
  let filteredArray = [];
  const arr = this;
  for (let i = 0; i < arr.length; i++) {
    if (cb(arr[i])) {
      filteredArray.push(arr[i]);
    }
  }
  return filteredArray;
};

Array.prototype.myReduce = function (cb, initialVal) {
  let arr = this;
  for (let i = 0; i < arr.length; i++) {
    initialVal = cb(initialVal, arr[i]);
  }
  return initialVal;
};

let mappedArray = a.myMap((e) => e + 1);

let filteredArray = a.myFilter((e) => e < 4);

console.log(
  a.myReduce((acc, e) => {
    acc.push(e + 9);
    return acc;
  }, [])
);

console.log(a.myReduce((acc, e) => acc + e, 0));
