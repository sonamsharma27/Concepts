const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((ele) => deepClone(ele));
  }
  let res = {};
  for (const key in obj) {
    res[key] = deepClone(obj[key]);
  }
  return res;
};

const original = {
  name: "Alice",
  meta: {
    age: 25,
    skills: ["JS", "React"],
    joined: new Date("2023-01-01"),
  },
};

const cloned = deepClone(original);

// Change original
original.meta.skills.push("Node");
original.meta.age = 30;

console.log(cloned.meta.skills); // ["JS", "React"]
console.log(cloned.meta.age); // 25

function deepEqual(a, b) {
  // 1. Handle strict equality first
  if (a === b) return true;

  // 2. Handle null/undefined
  if (a == null || b == null) return false;

  // 3. Handle non-objects (primitives)
  if (typeof a !== "object" || typeof b !== "object") return false;

  // 4. Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => deepEqual(val, b[i]));
  }

  //5. Handle Date objects
  if (v1 instanceof Date) {
    if (!(v2 instanceof Date)) return false;
    return v1.getTime() === v2.getTime();
  }

  // 6. Handle objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => keysB.includes(key) && deepEqual(a[key], b[key]));
}
