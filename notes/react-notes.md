# react-notes

```js
React.createElement(elementName, { ...attributes }, childrenElements);
```

// Returns a React element which is an object (of type `elementName`) with the specified attributes and children elements.
## // Example usage:
```js
const elementName = "div";
const attributes = { className: "container", id: "main" };
const childrenElements = [
  React.createElement("h1", null, "Hello World"),
  React.createElement("p", null, "This is a paragraph."),
];
const reactElement = React.createElement(
  elementName,
  attributes,
  ...childrenElements
);
```

// react element will be a object representing a div with the specified attributes and children.

```js
const root = ReactDOM.createRoot(document.getElementById("root"));
```

// THE `createRoot` method is used to create a root for rendering React elements into the DOM.
// It takes a DOM element as an argument, which is where the React elements will be rendered.
// This DOM element is typically obtained using `document.getElementById` or similar methods. It is a div with id = "root" in index.html
// This DOM element is where the React application will be mounted, allowing React to manage the DOM updates efficiently.
// root has a methdod called `render` that is used to render React elements into the DOM.
root.render(
  React.createElement(
    "div",
    { className: "container", id: "main" },
    React.createElement("h1", null, "Hello World"),
    React.createElement("p", null, "This is a paragraph.")
  )
```js
);
```

// npm is a package manager for JavaScript that allows developers to install, share, and manage packages (libraries or modules) for their projects.
// It is the default package manager for the Node.js runtime environment.
// npm allows developers to easily install and update packages, manage dependencies, and share their own packages with the community.
// package.json is a file that contains metadata about a Node.js project, including its dependencies, scripts, and other configuration details.
// package.json is a configuration file that is used by npm to manage the project's dependencies and scripts.

// ReactDOM is a package that provides methods for rendering React components into the DOM.
// It is used to interact with the DOM and manage the rendering of React components.
// ReactDOM provides methods like `render`, `hydrate`, and `unmountComponentAtNode` to manage the lifecycle of React components in the DOM.
// React.createElement is a method used to create React elements, which are the building blocks of React applications.

//Webpack is a tool that bundles JavaScript files and other assets for use in web applications.
// It takes modules with dependencies and generates static assets representing those modules.
// Webpack allows developers to write modular code and manage dependencies efficiently.
// It can also handle other assets like CSS, images, and fonts, making it a powerful tool for modern web development.
// Handles CSS and other assets by using loaders, which are transformations that are applied to the files before they are bundled.
// The transformations can include things like compiling Sass or Less to CSS, minifying CSS, or even transforming CSS with PostCSS plugins.
// Transformations include converting modern JavaScript (ES6+) to a version compatible with older browsers, optimizing images, and more.
// Webpack uses a configuration file (webpack.config.js) to define how the bundling process should be done, including entry points, output locations, loaders, and plugins.

## // Webpack features:
// 1. Module Bundling: Combines multiple JavaScript files into a single bundle, reducing the number of HTTP requests.
// 2. Dependency Management: Automatically resolves and includes dependencies between modules.
// 3. Loaders: Transforms files of different types (e.g., CSS, images) into modules that can be included in the bundle.
// 4. Plugins: Extends Webpack's functionality, allowing for tasks like minification, code splitting, and more.
// 5. Hot Module Replacement (HMR): Enables live reloading of modules during development, improving the development experience.
// 6. Code Splitting: Allows splitting the code into smaller chunks that can be loaded on demand, improving performance.
// 7. Tree Shaking: Removes unused code from the final bundle, reducing its size and improving performance.
// 8. Asset Management: Handles various types of assets (CSS, images, fonts) and optimizes them for production.
// 9. Development Server: Provides a local development server with live reloading capabilities, making it easier to develop and test applications.
// 10. Environment Variables: Allows configuration of different settings for development and production environments, enabling better control over the build process.
// 11. Source Maps: Generates source maps to help with debugging by mapping the bundled code back to the original source files.
// 12. Diagnostics: Provides detailed information about the build process, including warnings and errors, to help developers identify and fix issues quickly.
// 13. Minification: Reduces the size of the final bundle by removing whitespace, comments, and other unnecessary characters, improving load times.
// 14. Compression: Supports compression of assets (e.g., using gzip or Brotli) to further reduce the size of the files served to clients.

// css-loader converts styles.css into a JS module that exports CSS as a string.
// style-loader takes that string and injects it into a <style> tag in the <head> during runtime.
// MiniCssExtractPlugin	Generates a separate .css file

// JSX and React.createElement are two ways to create React elements, they serve the same purpose.
// JSX is a syntax extension for JavaScript that allows developers to write HTML-like code within JavaScript files.
// JSX is transformed into JavaScript code that uses React.createElement under the hood.
// JSX is not a part of React itself; it is a syntax extension that needs to be transpiled (usually with Babel) to convert it into valid JavaScript.

// React functional components are JavaScript functions that return React elements.
// React hooks are normal JS functions that allow developers to use state and other React features in function components.
// They are a way to create reusable components that can manage their own state and lifecycle.

// React is faster than other libraries because it uses a virtual DOM to efficiently update the real DOM.
// The virtual DOM is a lightweight representation of the real DOM that React uses to determine what changes need to be made to the real DOM.
// When a component's state or props change, React updates the virtual DOM first, then compares it with the previous version of the virtual DOM to determine the    minimal set of changes needed to update the real DOM.
// This process is called reconciliation, and it allows React to efficiently update the UI without having to re-render the entire DOM tree. -> go in depth of reconciliation
// React's reconciliation algorithm is optimized to minimize the number of updates to the real DOM, which is a slow operation.
// This makes React applications faster and more efficient, especially for complex UIs with many components.
// Reconciliation is the process of updating the real DOM based on changes in the virtual DOM.
// Diffing is the algorithm used by React to compare the current virtual DOM with the previous version and determine what changes need to be made to the real DOM.
## //Reconciliation in depth includes the following steps:
// 1. Render Phase -> creates new virtual DOM: React calls the render method of components to create a new virtual DOM tree.
// 2. Diffing: React compares the new virtual DOM tree with the previous one to identify changes.
// Diffing is done using a heuristic algorithm that compares nodes based on their type, key, and props.
## // Diffing algorithm includes:
// - If two nodes have the same type, React compares their props and children. If type is same, it checks if props are same, if not it updates the props.
// - If two nodes have different types, React replaces the old node with the new one.
// - If a node has a key, React uses it to identify the node and optimize updates.
// 3. Commit Phase: React applies the changes to the real DOM based on the identified differences.

//Way to use browser router in react
```js
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
```

## // Example Home component using Outlet to render children based on the URL:
```js
function Home() {
  return (
    <div>
      <h1>Home</h1>
      {/* This outlet will render children elements based on the url */}
      <Outlet />
    </div>
  );
}
```

```js
const routes = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
    errorElement: <Error />, // render this in case of any error
  },
  {
    path: "/v2",
    element: <Homev2 />,
  },
];
const app = createBrowserRouter(routes);
```

```js
root.render(<RouterProvider router={app} />);
```

//Hook to get param from the route url
```js
const param = useParams();
```

//why do we write super(props) in class comp ans do this.props instead of props
/**
 * Calls the constructor of the parent class (React.Component)
Passes props to the React.Component constructor, so that this.props is correctly set up
Without super(props), this.props will be undefined inside the constructor
 */

// ✅ Why use this.props instead of just props
## // Inside methods (outside the constructor), you don’t get props directly:

## // There are 2 phases in component life cycle:
// 1 Render Phase : Includes render
// 2 Commit Phase : Includes changes in the actual dom / expensive
/**
 * 
 * Render Phase
## The Render phase is where React determines what changes need to be made to the UI. During this phase:
React calls the render() method of class components or executes the function body of functional components.
It calculates the new Virtual DOM tree based on the component's current state and props. 
React then performs reconciliation, comparing this new Virtual DOM tree with the previous one to identify the differences (the "diff").
This phase is potentially interruptible in modern React (with concurrent rendering), meaning it can be paused or restarted if higher-priority updates arise.
The output of this phase is a description of the UI changes, but no actual DOM manipulations occur yet.

Commit Phase
The Commit phase is where React applies the changes identified in the Render phase to the actual DOM. During this phase:
React efficiently updates the real DOM based on the calculated differences. This includes inserting, updating, and removing DOM nodes.
Lifecycle methods like componentDidMount and componentDidUpdate (for class components) and useLayoutEffect hooks are executed synchronously after the DOM is updated.
Refs are updated to point to the correct DOM nodes or component instances.
useEffect hooks are run asynchronously in a "Passive Effects" phase after a short timeout.
The browser then repaints the screen to reflect these changes, making them visible to the user.
 */

// Custom hooks are functions that allow you to extract and reuse stateful logic in React components.
// They are a way to encapsulate and share logic between components without changing the component hierarchy.
// Custom hooks are prefixed with "use" to follow the convention and allow React to recognize them as hooks.
// They can use built-in hooks like useState, useEffect, and others to
// manage state, side effects, and other React features.
// Custom hooks can be used to encapsulate complex logic, such as form handling, data fetching
// or any other reusable functionality that can be shared across multiple components.


// Lifting state up in React means moving shared state to the nearest common ancestor of two or more components that need to use or modify it.
// 🧠 Why do we lift state?
## // Because in React:
// Data flows down (from parent → child via props)
// When sibling components or child-to-parent communication is needed, we must "lift" state up to a common parent

// Jest uses js-dom which provides a browser like env for testing
// use  it or test to write tests
// describe is used to group related tests together
// it or test is used to define individual test cases
// act is used to wrap code that causes React state updates, ensuring that the component updates are flushed before assertions are made.
// We need to provide browser routers for testing components that use routing.
// We need to provide a mock store for testing components that use Redux.
// We need to provide a mock implementation for any external dependencies that the component uses, such as APIs or libraries,     context providers.
## // Mock fetch implementation is as follows:
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     ok: true,
//     status: 200,
//     json: () => Promise.resolve({ message: "Success" }),
//   })
// );
// 

## // ✅ Each Fiber Node contains:
// Property	Description
// type	The component type (e.g. App, div)
// stateNode	The actual rendered DOM node or component instance
// props	The current props
// alternate	Link to the previous fiber (used for diffing)
// child, sibling, return	Tree links (children, siblings, parent)
// memoizedState	Used to store useState, useReducer, etc.
// effectTag	What to do during the commit phase (e.g. PLACEMENT, UPDATE, DELETION)


// A loadable component in React refers to a dynamically imported (code-split) component that is only loaded when needed, improving initial load time and performance.


//Go through CRP


// 🧭 Creating and Hydrating Routes in a React App
// To create and hydrate routes in a React application, you typically use React Router DOM (v6+). This allows you to define client-side routes and handle navigation without page reloads.
// ✅ BrowserRouter uses HTML5 History API
// ✅ Routes replaces the old Switch
// ✅ element prop uses JSX directly

// Hydration is used in Server-Side Rendering (SSR) apps like Next.js or using ReactDOM.hydrateRoot() manually

// import { hydrateRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";

// hydrateRoot(
//   document.getElementById("root"),
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );


## // 📦 Why Stale Closure Happens:
// JavaScript closures “remember” the variables in scope at the time they were created — not when they're used later.

## // This is common in:

// setTimeout
// event listeners
// async callbacks
// useEffect / useCallback

```js
function Counter() {
  const [count, setCount] = useState(0);
```

```js
  const handleClick = () => {
    setTimeout(() => {
      alert(count); // ❌ stale count
    }, 1000);
  };
```

```js
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

// 🔴 Even if the user clicks multiple times and count changes, the alert will show the count at the time handleClick was defined.


## // Fix:

// const countRef = useRef(count);
// useEffect(() => {
//   countRef.current = count;
// }, [count]);

// setTimeout(() => {
//   alert(countRef.current); // ✅ latest value
// }, 1000);

## // another fix:
// useEffect(() => {
//   const id = setInterval(() => {
//     console.log(count); // ✅ count is always fresh
//   }, 1000);

//   return () => clearInterval(id);
// }, [count]); // depend on what you use


// 🛠️ 4. How Do You Handle API Errors Globally?
//  Using Axios Interceptors
//  axiosInstance.interceptors.response.use(
//   res => res,
//   error => {
//     if (error.response?.status === 401) {
//       // redirect to login
//     } else {
//       console.error("API Error", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// 🔧 What createSlice Does Under the Hood
// createSlice is a utility from Redux Toolkit that simplifies writing Redux logic. Under the hood, it performs several tasks:

// ✅ 1. Generates Action Creators Automatically
## // You define reducers, and createSlice auto-generates matching action creators:
// ✅ 2. Attaches a Unique Action Type Prefix
// It uses the slice name as a prefix ("counter/increment") to namespace actions, preventing conflicts.

// ✅ 3. Creates a Reducer Function
// The reducers you define are combined into a single reducer function — internally, it's just a switch-case under the hood, keyed on action types.

// 🧙‍♂️ What Immer Does in createSlice
// Redux Toolkit uses Immer behind the scenes to let you mutate state directly in reducers safely.

## // Immer turns this "mutation" into an immutable update by:
// Creating a draft proxy of the state
// Tracking all changes to the draft
// Producing a new immutable state from those changes


// “Let’s say your seat layout page was lagging due to large DOM size. What steps would you take to identify and fix performance bottlenecks?”

// 🔍 1. Profiling the Bottleneck
## // 🛠️ Use Chrome DevTools > Performance tab:
## // Look for:

// Long scripting or rendering tasks

// Layout thrashing (reflow/repaint)

// Heavy memory usage

// Frequent state changes triggering re-renders

// 🔍 2. Use React DevTools Profiler
## // Check which components:

// Are re-rendering frequently

// Have slow render durations

// Can be memoized or split

// | Step                                   | Purpose                             |
// | -------------------------------------- | ----------------------------------- |
// | React DevTools Profiler                | Identify slow renders               |
// | `React.memo`, `useMemo`, `useCallback` | Reduce re-renders                   |
// | `react-window` / virtualization        | Render only visible seats           |
// | CSS-based effects                      | Prevent hover-related React renders |
// | Split state & logic                    | Localize updates                    |
// | Throttle heavy events                  | Avoid jank during resize/scroll     |


// 🔧 createAsyncThunk — Handles Asynchronous Logic

```js
import { createAsyncThunk } from '@reduxjs/toolkit';
```

```js
export const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  const res = await fetch(`/api/user/${id}`);
  return await res.json();
});
```

## // Automatically dispatches:

// user/fetch/pending

// user/fetch/fulfilled

// user/fetch/rejected

```js
import { createSlice } from '@reduxjs/toolkit';
import { fetchUser } from './thunks';
```

```js
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

```js
export default userSlice.reducer;
```


// | Area               | Improvement for Scale                            |
// | ------------------ | ------------------------------------------------ |
// | Architecture       | Feature-based folders, modular slices            |
// | Component Library  | Shared UI system with Storybook                  |
// | State Management   | Scoped + predictable state (RTK, Zustand, Query) |
// | Performance        | Lazy loading, virtualization, profiling          |
// | Observability      | Sentry, Web Vitals, logging tools                |
// | Team Collaboration | Nx Monorepo or Micro Frontends                   |
// | API Layer          | Centralized, typed, cache-enabled                |
// | Testing            | Per-feature + end-to-end flows                   |

// undefined usually means a variable has been declared but not assigned a value, or a function doesn’t return anything explicitly. null is an intentional assignment representing "no value."

// Controlled components are React-managed via useState or props. Uncontrolled components use refs to access values.

// Suppose your homepage's FCP is high — what steps would you take to debug and improve it?
## // Candidate:
## // I’d check:
// Large image sizes → compress
// Unused CSS → remove
// JS bundle size → split
// Third-party scripts → defer or load asynchronously
// Critical CSS → inline above the fold

// Q3: Explain the difference between shallow vs deep comparison in JavaScript. Why does React care?
## // Candidate:
// React uses shallow comparison in React.memo, shouldComponentUpdate, and useEffect dependencies. It only compares references. Deep comparison checks internal values recursively. Shallow comparisons improve performance but can cause bugs if state isn't immutable.

## // Follow-up:
// Can you show how incorrect shallow comparison might break a memoized component?

## // Candidate:
## // Sure — if I update an object in state without changing its reference:

// setUser({ ...user }); // Good
// user.name = 'John'; setUser(user); // Bad
// In the second case, the component won’t re-render since the reference is unchanged.

// Q4: Your component keeps re-rendering infinitely after a state update inside useEffect. What could be wrong?
## // Candidate:
// The most common cause is that the dependency array includes a value that changes every render, like a function or non-memoized object

// Q5: How do you debug performance bottlenecks in a slow React app?
## // Candidate:

// Use React DevTools Profiler to spot heavy components

// Use Chrome Performance tab to capture long frames

// Use why-did-you-render to detect unnecessary re-renders

// Audit bundle size with Webpack Bundle Analyzer

## // Follow-up:
// What do you do if App.js shows up as the most expensive component?

## // Candidate:
// Split it into smaller components. Use memoization and context boundaries. Sometimes, App.js handles routing or global state — I'd refactor those into separate providers or lazy-loaded chunks.

// Q7: How would you design a Modal component that is reusable and accessible?
## // Candidate:
// I’d use a portal to render it outside the main DOM tree. Add keyboard accessibility with Escape key to close. Trap focus inside the modal. Accept onClose, children, and isOpen props. I'd also ARIA-label it.

// What is portal
// Portal 

/**
 * Q9: What frontend issues might arise when a page has many interactive widgets/components (e.g., dashboard)?
## Candidate:

Excessive re-renders
Memory leaks from lingering timers/listeners
Layout thrashing due to frequent DOM reads/writes
Event bubbling conflicts
Large JS bundle → slow TTI

## Follow-up:
### How would you plan architecture for such a page?

## Candidate:

Dynamically import heavy widgets
Mount/unmount based on viewport or tab activity
Use context boundaries for isolated state
Use React.memo, Suspense, and lazy


## Interviewer:
Let’s say you’re building a performance-sensitive dashboard with 15+ widgets, each polling API data. How would you design the system to scale?

## Candidate:

Use React Query with caching and background refetching
Defer off-screen widgets with lazy loading
Batch API calls where possible
Use IntersectionObserver to pause polling when widgets aren’t visible
Memoize individual widgets and lift shared state to reduce duplication

## Follow-up:
### What if one widget fails? Should it crash the dashboard?

## Candidate:
No. I’d isolate widgets using error boundaries and show fallback UIs. This ensures the rest of the dashboard remains usable.
 */

// Closures can cause memory leaks if references are held unnecessarily, like in event listeners or timers.

/**
 * function setup() {
```js
  let largeData = new Array(1000000).fill("x");
  document.getElementById("btn").addEventListener("click", () => {
    console.log(largeData[0]); // closure holds largeData
  });
}
  Even if setup finishes, largeData stays in memory due to the closure.
```


  Q: How do you approach breaking down a large component?

## A:

Identify reusable UI patterns (e.g., cards, buttons).
Extract form fields or repeatable logic into smaller components.
Separate presentational and container components (logic vs UI).
Ensure each component does one job.
Extract state logic into custom hooks

## Follow-up:
### How would you share behavior (e.g., validation) across 10+ form fields?

## A:
Use a custom hook like useValidation() to encapsulate shared logic and keep the form fields lean.
 

Q: A button click updates a counter, but another unrelated component also rerenders. How do you debug and prevent this?

## A:

Use React DevTools to inspect renders.
Use React.memo to memoize the unrelated component.
Check context/state boundaries.
If using context, memoize its value.

## Follow-up:
### How does using a non-memoized value in context cause rerenders?

## A:
If the value prop to the context provider changes on every render (e.g., a new object/array), all consumers rerender.

Q: What are concurrent features in React 18? How does useTransition improve UX?

## A:
Concurrent React can interrupt renders to keep UI responsive.
useTransition marks updates as non-urgent, allowing urgent updates like typing to remain smooth.

## Follow-up:
### When would you use useTransition?

## A:

Search filter in a large list
Sorting large tables
Navigating to routes with heavy content

Q: A modal isn’t centering correctly in all browsers. How would you debug it?

## A:

Inspect computed styles in Chrome DevTools
Use layout tab to visualize box model
Check CSS resets and browser-specific styles
Check transform or position context

## Follow-up:
### What would you check if the modal is offset in Safari but fine in Chrome?

## A:

Vendor-specific CSS behavior
Default margin/padding differences
Safari’s treatment of vh/vw units
Positioning context and z-index stacking
*/

/**
 * Q: What are Core Web Vitals, and how do they impact frontend work?

## A:
## Core Web Vitals are Google’s key UX metrics:
LCP (Largest Contentful Paint) – load speed
FID (First Input Delay) – input responsiveness
CLS (Cumulative Layout Shift) – visual stability
## They affect SEO and user satisfaction. As a frontend dev, we optimize them by:
Lazy loading images
Removing layout shifts
Reducing JS execution time

## Follow-up:
### How would you debug a high CLS score?

## A:

Use Chrome Lighthouse
Avoid height: auto without fallback
Set image/video width and height
Use CSS aspect-ratio
 */

/**
 * Structuring
 * src/
├── components/
│   └── Button/
├── features/
│   └── Cart/
├── hooks/
├── pages/
├── store/
├── utils/
├── types/
Use feature-based structure. Each feature folder may contain its own slice, components, tests, and styles.
 */

/**
 * ✅ First: What are React hooks?
Hooks like useState, useEffect, useContext, etc., are functions that allow React to track state and lifecycle in functional components.

## But React has strict rules of hooks, mainly:

🔒 Rule of Hooks (React official rule)
Hooks must only be called at the top level of a React function component or a custom hook.

## So, you cannot call hooks:
Inside plain JS functions
Inside loops
Inside conditions

🧠 Why this rule exists
✅ React relies on call order — not names — to track hook state.
React uses the order in which hooks are called in the component to match them with internal hook states across renders.

If you put a hook in a plain JS function, and that function is called conditionally or dynamically, React can’t predict when it will run — breaking the internal order of hooks.

✅ Custom Hooks Are Safe — They Follow the Rules
## A custom hook is a plain function that:

Starts with the name use
Always calls hooks in a fixed order
Is called only at the top level of a component or another hook
 */
