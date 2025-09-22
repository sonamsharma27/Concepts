
/*
A superset of JavaScript that adds static typing.
Static typing means variable types are known and checked at compile time.
Helps catch errors at compile time, not just runtime.
Fully integrates with modern frameworks like React, Vue, etc.

 */


// Union & Literal Types
// let status: "loading" | "success" | "error" = "loading";
// let value: number | string = 42;


type User = {
  id: number;
  name: string;
  email?: string; // optional
};

interface Product {
  name: string;
  price: number;
}


// | Feature     | `interface`                  | `type`                                       |
// | ----------- | ---------------------------- | -------------------------------------------- |
// | Extending   | Can extend or implement      | Can extend via intersections                 |
// | Merging     | Supports declaration merging | ❌ No merging                                 |
// | Flexibility | Better for object shapes     | More flexible for unions, primitives, tuples |
// Use interface for objects, components props, and public APIs.
// Use type for union types, mapped types, and utility types.

function add(a: number, b: number): number {
  return a + b;
}

// Type Inference & Assertions

let age = 25; // inferred as number
let input = document.getElementById("name") as HTMLInputElement;


// Generics
function identity<T>(arg: T): T {
  return arg;
}
// Why use generics instead of any?
// any disables type checking.
// Generics retain type info and are reusable.
//Safer, better autocompletion, reusable.


//Enums
enum Status {
  Loading,
  Success,
  Error,
}


// Partial, Readonly, Pick, Record, Omit — utility types.
type UserPartial = Partial<User>;
type UserReadOnly = Readonly<User>;


//  How would you make all props optional in a type?
// Use the built-in utility type Partial<T>:

// type User = {
//   name: string;
//   age: number;
// };

// type OptionalUser = Partial<User>;




// | Type      | Description                                          | Use Case                              |
// | --------- | ---------------------------------------------------- | ------------------------------------- |
// | `any`     | Turns off type checking                              | Avoid unless migrating from JS        |
// | `unknown` | Like `any` but safer — forces type checks before use | Safer alternative to `any`            |
// | `never`   | Represents values that never occur                   | For unreachable code, error functions |


// const inputRef = useRef<HTMLInputElement | null>(null);
// const [count, setCount] = useState<number>(0);
// const [user, setUser] = useState<User | null>(null);



