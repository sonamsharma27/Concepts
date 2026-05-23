# react-fundamentals

Performance Optimization

React.memo — Prevents re-renders if props haven’t changed.
useCallback, useMemo — Avoids re-creating functions/values.
Lazy loading components (React.lazy, Suspense).
Using async/defer scripts
Minimizing critical resources / loading only above the fold conent during initial load
Serving only critical css on page load
Caching at CDN
Throttling/debouncing
Minify css/js
Lazy loading 
Code splitting
webp / sprite for image performance
Resource hints
Compression -> Brotli / Gzip


### How do you prevent unnecessary re-renders?
React.memo to memoize components.
useCallback to memoize functions.
useMemo to memoize values.

### Why is key important in lists?
Helps React identify which items changed, added, or removed.
Prevents unnecessary re-renders.

### How does the virtual DOM work?
Virtual DOM is an in-memory representation of the real DOM.

## On updates:
React creates a new virtual DOM.
It compares (diffs) it with the previous one.
It calculates the minimal set of changes.
React updates only what's necessary in the real DOM.


useRef stores mutable values that persist across renders.
Can reference DOM elements.

forwardRef allows passing refs to child components.
```js
const MyInput = forwardRef((props, ref) => <input ref={ref} />);
```


| Feature     | Redux                        | Context API              |
| ----------- | ---------------------------- | ------------------------ |
| Usage       | Large-scale global state     | Small-scale shared state |
| Boilerplate | High (actions, reducers)     | Minimal                  |
| Dev Tools   | Excellent                    | Limited                  |
| Middlewares | Supported (e.g. thunk, saga) | Not native               |


### What is React Fiber?
Fiber is the reconciliation engine in React (introduced in v16).
It improves rendering by making it interruptible, incremental, and prioritized.

## Old React (stack reconciler):
Recursive and synchronous.
Could block the main thread on large trees.

## Fiber:
Breaks rendering into small units of work (called fibers).
Allows pausing and resuming rendering.
Enables features like concurrent mode, Suspense, and selective hydration.

Reconciliation Phases

1. Render Phase (Reconciliation) — Pure, side-effect free
Builds the fiber tree.
Can be paused/interrupted.

2. Commit Phase — Mutates the DOM
Runs side effects (useEffect, componentDidMount).
Non-interruptible.


Fiber is React’s new reconciliation engine, introduced to allow interruptible, incremental rendering. It solves the performance bottleneck of synchronous rendering in large apps and enables features like concurrent rendering, Suspense, and time slicing.


### How does React achieve async rendering?
## Answer:
React breaks work into small units (fiber nodes) and uses its internal scheduler to assign priorities.
This allows it to pause rendering, handle urgent updates (like user input), and resume later, improving responsiveness.

### What is Concurrent Rendering?
## Answer:
Concurrent rendering allows React to prepare multiple UI versions in parallel without blocking the main thread.
React can start rendering, pause to do something urgent (like respond to a click), and then resume — leading to smoother UX.


useCallback
Returns memoized version of a callback to avoid unnecessary re-renders.

```js
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

useMemo
Memoizes a computed value to avoid expensive recalculations.
```js
const sortedData = useMemo(() => sort(data), [data]);
```


useReducer
For complex state logic, like Redux in a local component.
```js
const [state, dispatch] = useReducer(reducer, initialState);
```

### Can you use async inside useEffect?
No, useEffect cannot take an async function directly because it expects the return value to be either undefined or a cleanup function, not a Promise.

Scenario where useCallback improves performance
When passing a function as a prop to a child component that is memoized with React.memo.
```js
const Parent = () => {
  const [count, setCount] = useState(0);
```

```js
  const handleClick = useCallback(() => {
    console.log("Clicked!");
  }, []); // stable reference
```

```js
  return <Child onClick={handleClick} />;
};
```


```js
// Without useCallback, Child would re-render every time due to new function identity
```

Without useCallback, a new function is created on every render → breaks memoization in the child.


| `useEffect`                     | `useLayoutEffect`                                                       |
| ------------------------------- | ----------------------------------------------------------------------- |
| Runs **after** paint            | Runs **before** paint                                                   |
| Non-blocking                    | Blocking (synchronous)                                                  |
| Used for async effects, logging | Used when DOM reads/writes must be synchronous (e.g., measuring layout) |


 How to handle race conditions in useEffect
Race conditions happen when multiple async effects run and the last response to return is not the latest initiated.
```js
// Like api calls triggered inside useEffect
```

## 🛠️ Fix using an abort flag or AbortController:


React's Rule of Hooks
Always call hooks at the top level.
Never call them inside loops, conditions, or nested functions.


Hooks cannot be used conditionally because React relies on the order of hook calls to correctly associate them with the right state or effect.

Why Hooks Shouldn’t Be Called Inside Loops, Conditions, or Nested Functions
React relies on consistent call order of hooks between renders to match internal data (like state) correctly.
## If you call a hook inside:
a loop
a condition
or a function

➡️ the order of hook execution might change between renders, and React can’t guarantee which state belongs to which hook.

If you start conditionally skipping items, you mess up the order and React reads the wrong data for the wrong hook.


```js
//Optimizations
```

React.memo

Prevents unnecessary re-renders of functional components when props haven't changed.

```js
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

## 📌 When to use:
Pure/dumb components.
Components receiving same props repeatedly.


useMemo for Expensive Computations

useCallback for Stable Functions

Lazy Loading with React.lazy & Suspense
Split your code into chunks and load components only when needed.

Avoid Inline Functions & Objects in JSX
Every render creates new references — breaks React.memo.
```js
// ❌ Bad
<Component onClick={() => doSomething()} />
```

```js
// ✅ Good
const handleClick = useCallback(() => doSomething(), []);
```

<Component onClick={handleClick} />

Throttle/Debounce Events

```js
//Optimizations
```


### What is virtualization in React? When do you use it?
## ✅ What they expect:

You know about libraries like react-window or react-virtualized.
Used for rendering only visible portions of large lists for performance.

### How would you optimize a component that renders a large list?
## ✅ Expected answer:

Use virtualization
Avoid inline functions in child components
Use React.memo for child items
Avoid unnecessary state

### How does React batch updates?
## ✅ Answer:

React batches multiple setState calls in the same event loop tick.
You can also force batching in async code using flushSync (React 18+ handles this better).

React.memo and useMemo add CPU cost for comparison/memoization.
They should only be used when render cost is high or props are stable.

## Usecontext:
useContext will re-render every component that uses it when the value changes.
If the context holds complex or large state, consider splitting context or using memoization.

### How to optimize frequent updates in useContext?
Use useMemo to avoid unnecessary re-renders.
Split large context into smaller ones


## How useContext works internally in React:

✅ 1. createContext() creates a context object
```js
const MyContext = React.createContext(defaultValue);
```

## This object includes:

.Provider — a special React component that holds the value.
.Consumer — used internally (or directly in class components).
A currentValue tracked by React internally.

✅ 2. Using useContext(MyContext) inside a component
## When React renders a component that calls useContext(MyContext):

It looks up the component tree to find the nearest <MyContext.Provider>.
If found, it returns the value from that Provider.
If no Provider is found, it returns the defaultValue set in createContext().

🔧 Internals (How React tracks context updates)
## React does not use event listeners or observers for context. Instead, it uses:

🧱 Context propagation mechanism
## Each context value change triggers:
Marking affected components that use that context.
Efficient scheduling and re-rendering only for those components.

## This is possible because:
React tracks which components consume which context during render.
Context values are stored in fiber nodes during reconciliation.

Unlike Redux with useSelector, React doesn't offer a built-in way to read partial values of context — so any change in context value re-renders all consumers.

⚙️ Fiber's Role in useContext

## React uses its Fiber architecture to:
Track all context dependencies for each component.
Avoid re-rendering unrelated parts of the tree.

## Each fiber node has:
dependencies.contexts — a set of context objects it's subscribed to.
When a context updates, React walks through the tree, finds all fibers depending on that context, and schedules updates.


Pros of Redux
Predictable state
Centralized store
Debuggable via dev tools
Middleware support
Good for large-scale apps


Explain Redux flow in React.
UI dispatches an action via dispatch({ type: 'INCREMENT' })

Action reaches middleware (optional step)

Action passes to the reducer

Reducer returns new state

Store is updated

UI reads the updated state via useSelector

Reducers are pure functions that take the current state and an action, and return the next state

handle async actions in Redux: using middleware like redux-thunk

| Feature           | Redux (classic)      | Redux Toolkit (RTK)          |
| ----------------- | -------------------- | ---------------------------- |
| Boilerplate       | High                 | Reduced                      |
| Store setup       | Manual               | `configureStore` handles all |
| Async logic       | Manual or with Thunk | `createAsyncThunk` included  |
| Reducer + actions | Separate             | Unified via `createSlice`    |


### How would you split Redux logic in large applications?
## ✅ Best practices:

Feature-based folders (e.g., features/user/, features/posts/)

Create separate slices per feature

Combine reducers using combineReducers

Use selectors to isolate state usage

Use middleware for async logic per slice

### What is middleware in Redux?
Middleware is a function that intercepts actions before they reach reducers.

## Use it to:
Handle async operations (e.g., API calls)
Log actions/state
Perform side-effects (e.g., analytics, error reporting)

### How does createSlice() work?
## createSlice() is an RTK function that:
Generates action creators and reducer in oneplace
Automatically handles immutability with Immer

```js
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1,
  },
});
```


### What is Redux Thunk?
Redux Thunk is a middleware for Redux that allows you to write action
 creators that return a function instead of an action.

### Why?
## By default, Redux only allows you to dispatch plain objects:
```js
dispatch({ type: "LOGIN_SUCCESS" });
```


## But with Redux Thunk, you can do:
```js
dispatch(async (dispatch, getState) => {
  const res = await fetch('/api/user');
  const data = await res.json();
  dispatch({ type: 'USER_FETCHED', payload: data });
});
```


| Use Case             | How Thunk Helps                                      |
| -------------------- | ---------------------------------------------------- |
| **Async logic**      | Like fetching API data, timeouts, etc.               |
| **Side-effects**     | Logging, navigation, conditionally dispatching       |
| **Access state**     | Can read current state using `getState()`            |
| **Chaining actions** | Dispatch one action after another based on condition |


```js
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
```

```js
const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});
```

```js
// Thunk Action
export const fetchUser = () => async (dispatch, getState) => {
  dispatch({ type: 'USER_LOADING' });
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    dispatch({ type: 'USER_LOADED', payload: data });
  } catch (err) {
    dispatch({ type: 'USER_ERROR', error: err.message });
  }
};
```


🔍 What is RTK Query?
## RTK Query is a data fetching and caching solution built on top of Redux Toolkit. It:

Automates API requests
Handles caching, loading states, and error states
Avoids writing reducers, action types, and thunks manually
Offers powerful utilities like useQuery, useMutation


```js
// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
```

```js
export const api = createApi({
  reducerPath: 'api', // Unique key in store
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `user/${id}`,
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `user/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
  }),
});
```

```js
export const { useGetUserQuery, useUpdateUserMutation } = api;
```


```js
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
```

```js
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
```


```js
import { useGetUserQuery, useUpdateUserMutation } from './services/api';
```

```js
function Profile({ userId }) {
  const { data, error, isLoading } = useGetUserQuery(userId);
  const [updateUser] = useUpdateUserMutation();
```

```js
  if (isLoading) return <div>Loading...</div>;
```

```js
  return (
    <div>
      <h2>{data.name}</h2>
      <button onClick={() => updateUser({ id: userId, name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
}
```


📦 Component Update Flow in React

Functional Component
JSX is parsed → React.createElement()

React creates a new fiber for this element

Compares it with the previous one

Determines what needs to be updated

Schedules DOM updates efficiently


## Use HOC when:
You want to enhance or wrap a UI component (e.g., adding layout, theming, conditional rendering).
You need to inject additional props or behavior into components.
You're working in class-based components (Custom Hooks don’t work here).
You want to follow the container-presentational pattern.


## ✅ Use Custom Hooks when:
You want to extract and reuse logic, not UI.
You want to share side effects, state, or event handlers.
You’re working in function components (post React 16.8).
You need composability — one custom hook can use another.


connect is a function from the react-redux library.
It connects your React component (SeatComponent) to the Redux store.
This allows your component to access state and dispatch actions as props.

Arguments
## mapStateToProps:
A function that selects the part of the Redux state you want to provide to your component as props.
In your case, it will provide a prop called SeatInfo.

## mapDispatchToProps:
A function or object that provides action dispatchers as props.
Here, it injects many functions (like detailsShow, continueToCustInfo, etc.) into your component.

Result
The result is a higher-order component that wraps SeatComponent.
## SeatComponent will now receive:
State from Redux (as defined in LinkStateProp)
Action dispatchers (as defined in LinkDispatchProps)


| Question                                         | Pattern(s) to Mention                                  |
| ------------------------------------------------ | ------------------------------------------------------ |
| How do you share logic between components?       | Custom Hooks, HOC, Render Props                        |
| How do you manage large-scale state?             | Flux/Redux, Context API                                |
| How do you structure your components?            | Presentational/Container, Compound Components          |
| How do you optimize performance?                 | Memoization + Strategy Pattern                         |
| How do you build scalable frontend architecture? | Modular pattern, MVVM, Singleton for configs/utilities |


🔁 Component Patterns (React-specific)

1. Presentational vs. Container Components
Presentational: Focus on UI, dumb components.

Container: Handle state, logic, and data fetching.

2. Higher-Order Components (HOC)
Functions that take a component and return a new component.

Example: withAuth(Component), connect() from Redux.

3. Render Props
A technique for sharing logic using a function as a child.

```html
<DataProvider render={(data) => <Chart data={data} />} />
```

4. Custom Hooks
Abstract reusable logic (e.g., useAuth, useFetch).
Modern replacement for HOCs and render props.

5. Compound Components
Components that work together via context.

Example: <Tabs> <TabList/> <TabPanel/> </Tabs>

🧠 JavaScript Design Patterns (Core)
6. Module Pattern
Encapsulates logic; uses closures or IIFEs to create private state.

7. Singleton
Ensures a class has only one instance (e.g., ThemeManager, EventBus).

8. Observer (Pub-Sub)
Event-based communication between decoupled parts.

Used in state management, custom event emitters.

9. Factory Pattern
A function that returns different types of objects based on input.

10. Strategy Pattern
Encapsulate interchangeable behaviors.

Example: Different sorting/filtering algorithms passed as props.

⚙️ Architecture Patterns
11. Flux/Redux Architecture
Unidirectional data flow using actions, reducers, store.

Interview must-know if Redux is mentioned.

12. MVVM / MVC (in React terms)
Model-View-Controller principles help in organizing business logic, view, and data binding separately.


Strategy Pattern (Encapsulating Behaviors)
## ✅ What it is:
Defines a family of algorithms/strategies and makes them interchangeable. The object using them can switch between them at runtime.

## 🧠 Use Case in Frontend:
Used when different algorithms/behaviors are needed dynamically — e.g., filtering, sorting, or formatting logic.

## 👇 Example (React):
```js
const sortByName = (a, b) => a.name.localeCompare(b.name);
const sortByAge = (a, b) => a.age - b.age;
```

```js
function sortUsers(users, strategy) {
  return [...users].sort(strategy);
}
```

```js
// Usage
const sorted = sortUsers(users, sortByAge); // or sortByName
```


Factory Pattern (Object Creation)
## ✅ What it is:
Encapsulates object creation logic and returns different objects based on input without exposing the instantiation logic.

## 🧠 Use Case in Frontend:
When you want to create UI components, widgets, form fields, or API clients dynamically based on config or type.

## 👇 Example (React Form Element Factory):
```js
function FormField({ type, ...props }) {
  switch (type) {
    case 'text':
      return <input type="text" {...props} />;
    case 'select':
      return <select {...props} />;
    case 'checkbox':
      return <input type="checkbox" {...props} />;
    default:
      return null;
  }
}
```

```js
// Usage
```

<FormField type="text" placeholder="Name" />
<FormField type="select" options={["A", "B"]} />

SingletonPattern 
The Singleton pattern ensures that only one instance of a class or object exists in your application and provides a global access point to it.


```js
const ThemeManager = (function () {
  let instance;
```

```js
  function createInstance() {
    return {
      theme: "light",
      setTheme(newTheme) {
        this.theme = newTheme;
      },
      getTheme() {
        return this.theme;
      },
    };
  }
```

```js
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
```

## Usage:
```js
const t1 = ThemeManager.getInstance();
t1.setTheme("dark");
```

```js
const t2 = ThemeManager.getInstance();
console.log(t2.getTheme()); // "dark" — same instance
```

## Class based version:

```js
class ThemeManager {
  static #instance;
```

  constructor() {
```js
    if (ThemeManager.#instance) return ThemeManager.#instance;
    this.theme = "light";
    ThemeManager.#instance = this;
  }
```

  static getInstance() {
```js
    return new ThemeManager();
  }
```

  setTheme(t) {
```js
    this.theme = t;
  }
```

  getTheme() {
```js
    return this.theme;
  }
}
```


## SOLID principles:

| Principle | React/Frontend Analogy                          |
| --------- | ----------------------------------------------- |
| SRP       | Separate components/hooks for logic/UI          |
| OCP       | Use props, children, HOCs, custom hooks         |
| LSP       | Use predictable, interchangeable components     |
| ISP       | Create focused interfaces and prop types        |
| DIP       | Inject dependencies (e.g., data fetching layer) |
