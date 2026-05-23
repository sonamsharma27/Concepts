# hiringManager

// Q: How do you decide when to build reusable components vs custom ones?
## // 🟢 Answer:
// I look at usage frequency, and future variability. If a component is likely to be used in multiple places with similar props and behavior (like buttons, dropdowns), I extract it early. But for unique use cases with unclear requirements, I wait until at least 2–3 implementations show a repeatable pattern.

// Q: The main product page takes ~5s to load on mobile 3G. Where do you start?
## // 🟢 Answer:
## // I’d use Lighthouse and Chrome DevTools Performance tab to analyze the breakdown. I'd check:
// TTFB from server
// Bundle size (tree-shaking, lazy-loading)
// Unused JS/CSS
// Image formats
// Third-party scripts
// Defer or make scripts async
// Usually, JS blocking time and large initial payloads are the culprits.

// Follow-up: What if React rendering is fast but TTI is still high?
## // 🟢 Answer:
## // That indicates the main thread is blocked — likely due to large JS parsing/execution. I’d:
// Split the bundle
// Lazy load non-critical features
// Use web workers for heavy computation
// Audit 3rd-party dependencies

// How do you handle slow API calls in the UI?
## // 🟢 Answer:
// Show skeletons or loading indicators with optimistic fallback (if applicable). For slower endpoints, I use stale-while-revalidate via React Query and caching to reduce perceived delay. I also batch requests or debounce search calls.

// You’re given a rough PRD, but no UX spec. What do you do?
## // 🟢 Answer:
// I first clarify the user goals with the PM. Then I sketch wireframes myself and share with design for feedback. If the designer is unavailable, I lean on existing design tokens and components to keep UI consistent. Once approved, I proceed incrementally and validate early with PMs/stakeholders.

// A core feature you worked on has a major bug in production. What do you do?
## // 🟢 Answer:
// First, I validate and isolate the issue. If it’s critical, I create a hotfix PR immediately, alert my team, and flag customer support. I also add regression tests before merging. After resolution, I document it and open a root cause analysis discussion — including how we can catch such bugs earlier (e.g., visual testing or type safety).


// Q: How would you mentor a junior dev struggling with React state management?
## // 🟢 Answer:
// I’d pair with them on small tasks, walk through data flow diagrams, and explain state scoping (local vs global vs derived). I use analogies (e.g., React state as controlled memory) and ask them to refactor a simple component using useReducer or context. I also recommend building a small project end-to-end.


// Q: Suppose a major offer isn’t showing up on the layout. What’s your debugging workflow?
## // 🟢 Answer:
// First, I check the network call in DevTools to ensure the offer API is firing and the payload is valid. If it is, I check the Redux slice/state mutation and component props — I usually add log markers or use React DevTools to inspect props live. If there’s an async mismatch (e.g., UI renders before offer data loads), I fallback to a loading state or retry.

// Your backend API response shape keeps changing, and it breaks your frontend frequently.
// I suggest creating a shared api-contracts package in TypeScript containing request and response interfaces for all APIs. This is versioned and used in both frontend and backend to ensure type safety and contract alignment.

// To prevent runtime issues, I also use zod for runtime validation. On the frontend, I isolate API logic using adapters or transformers so that if the backend changes, the UI code stays unaffected. And for smoother development, I use MSW to mock APIs locally.


## // ✅ Problem Statement:
// “Different users with different roles (e.g., Admin, Operator, Support) log into the same dashboard. How do you show only the features, metrics, or data relevant to each role?”

## // 🎯 Goals:
// Securely show/hide routes, tabs, widgets, and filters
// Avoid unnecessary API calls or rendering logic for unauthorized roles
// Ensure easy extensibility if new roles are added
// Keep UI clean and scoped per role


// 🔧 Step-by-Step Approach
// 1. Role Comes from Auth Layer
## // After login, backend sends a JWT or session that includes the user’s role:
// {
//   "userId": "u123",
//   "role": "operator",
//   "name": "Sonam Sharma"
// }
// Store it securely in context/global state (e.g., AuthProvider or Zustand)

// 2. Central Role Config Map
## // Define a config for what each role can access:
// export const roleConfig = {
//   admin: {
//     canViewRevenue: true,
//     canViewCancellations: true,
//     canAccessUserList: true,
//     visibleWidgets: ['bookings', 'revenue', 'cancellations'],
//   },
//   operator: {
//     canViewRevenue: true,
//     canViewCancellations: false,
//     visibleWidgets: ['bookings', 'revenue'],
//   },
//   support: {
//     canViewRevenue: false,
//     visibleWidgets: ['bookings'],
//   },
// };


// 3. Conditional Rendering in UI
## // Use this config to conditionally render tabs, cards, filters:
// {roleConfig[role].visibleWidgets.includes('revenue') && (
//   <RevenueCard />
// )}

## // You can also use wrapper components or HOC:
// <RoleGuard roles={['admin', 'operator']}>
//   <RevenueTab />
// </RoleGuard>


// 4. Route Protection (React Router / Next.js)
// For route-based dashboards (/admin, /operator, etc.)

// Protect routes via layout or middleware
// if (!allowedRoles.includes(user.role)) {
//   return <Navigate to="/unauthorized" />;
// }

// 5. API Optimization: Pass Role on Server
## // Avoid fetching irrelevant data:
// GET /api/metrics?role=operator
// Or fetch a pre-filtered config from backend based on role.


## // 🔐 Security Note:
// Do NOT rely on frontend-only checks for sensitive data.
// Always verify role permissions server-side too.
// Even if UI hides buttons, API should enforce role access.


// 🔐 What is Route Protection?
## // Route protection is the mechanism to:

// Restrict access to certain routes based on auth (logged in or not)
// Restrict access further based on authorization (role, permissions)

// 🧱 Route Protection = 2 Layers
// | Layer            | What it does                      | Example                             |
// | ---------------- | --------------------------------- | ----------------------------------- |
// | ✅ Authentication | Checks if user is logged in       | Block `/dashboard` if not logged in |
// | ✅ Authorization  | Checks if user is allowed to view | Block `/admin` if not an admin      |

// 💡 Common Tech Stack Scenarios

// | Framework            | Common Tools                    |
// | -------------------- | ------------------------------- |
// | React (SPA)          | React Router, Context, Zustand  |
// | Next.js (App Router) | Middleware, Server Components   |
// | React Native         | React Navigation + auth context |

// ✅ Deep Dive: React (React Router v6+)

// 🔧 1. Auth Context

// // auth-context.tsx
// export const AuthContext = React.createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { id, role }

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const userInfo = parseJWT(token); // or call /me
//       setUser(userInfo);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// 🔐 2. ProtectedRoute Wrapper
// // ProtectedRoute.jsx
// import { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from './auth-context';

// export const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user } = useContext(AuthContext);

//   if (!user) return <Navigate to="/login" />;
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// 🧭 3. Routing with React Router
// <Routes>
//   <Route path="/login" element={<Login />} />
  
//   <Route
//     path="/dashboard"
//     element={
//       <ProtectedRoute>
//         <Dashboard />
//       </ProtectedRoute>
//     }
//   />
  
//   <Route
//     path="/admin"
//     element={
//       <ProtectedRoute allowedRoles={['admin']}>
//         <AdminPanel />
//       </ProtectedRoute>
//     }
//   />
// </Routes>


// 📦 Scalable Variant — Role Config Map
// // role-permissions.ts
// export const routePermissions = {
//   '/admin': ['admin'],
//   '/reports': ['admin', 'operator'],
//   '/support': ['support', 'admin'],
// };


## // Then centralize logic:
// const route = useLocation().pathname;
// const allowedRoles = routePermissions[route];

// <ProtectedRoute allowedRoles={allowedRoles}>
//   <Outlet />
// </ProtectedRoute>

// | ✅ Practice                              | Why it matters                                    |
// | --------------------------------------- | ------------------------------------------------- |
// | Use **middleware** or **server guards** | Prevents showing protected pages even for 1 frame |
// | Validate roles **server-side**          | Frontend-only logic can be bypassed               |
// | Store role in **JWT** or `/me` endpoint | Reliable and consistent                           |
// | Avoid role-specific logic in JSX only   | Use routing + layout guards                       |


// In the Seat Layout Page, my goal was to build a highly modular, responsive, and scalable page without reinventing existing logic. I took the seat layout component from another codebase, decoupled it, and moved it to our component library after parameterizing key behaviors. Then I structured the page into reusable blocks like Header, SeatLayoutRenderer, BusDetails, and FareSummary.
// This architecture allowed different funnels (web, WhatsApp) to use the same seat layout logic but customize peripheral behavior like offers or CTAs. I also added tests, Storybook coverage, and handled responsive design using ResizeObserver for layout width constraints.


// Q: Why keep fetched data in a state? Why not just use local variables?
## // 🟢 Answer:
## // Keeping fetched data in component or global state ensures:
// The UI reactively updates when the data changes
// You avoid refetching unnecessarily if user navigates between pages
// It allows sharing across components (e.g., fare + seat layout + summary)

// ✅ Interview Tips: How to Think About State Lifetime

// | Question                                 | Keep or Clear?            |
// | ---------------------------------------- | ------------------------- |
// | Needed across multiple components/pages? | ✅ Keep (shared/global)    |
// | Needed only for a modal/input/etc?       | ❌ Clear (local state)     |
// | Should persist during session?           | ✅ Keep (Zustand, context) |
// | Should reset on form step change?        | ✅ Clear partially         |
// | Data is sensitive (e.g., booking)?       | ✅ Clear on exit           |


// 🧱 1. Page-Level Architecture
// ❓"How would you structure a complex page like a booking dashboard or checkout flow?"
## // 🧠 Talk about:
// UI => Breaking it into modular components
// Logic/state => Colocating logic with UI (hooks, slices)
// Using layout wrappers, route guards
// Managing local vs global state
// Performance optimizations (memoization, lazy-loading)


// ❓"How would you scale your frontend for 5x more traffic?"
## // 🟢 Answer:

// use modulde bundler like webpack
// throttling/deboncing APIs
// caching using react query, CDN, Redis cache
// small bundle size
// deferring non-critical scripts
// iniling critical CSS
// image optimization -> Progressive rendering, webp and avif formats, serving images as per device size
// assets compressiom -> brotli/gzip
// resource hints
// batch api requests if possible

// To scale the frontend for 5x more traffic, I’d focus on optimizing performance, network efficiency, and rendering strategy — both from a client-side and infrastructure perspective.

// ✅ 1. Optimize Rendering & Delivery
// 🧠 Choose the right rendering model
// Use Static Site Generation (SSG) for pages that don’t change often (e.g., homepage, about)
// Use Server-Side Rendering (SSR) for dynamic, SEO-sensitive pages (e.g., search results)
// Use Client-Side Rendering (CSR) for highly interactive views (e.g., dashboards)
// In Next.js, this means choosing getStaticProps, getServerSideProps, or API + React hooks appropriately.


// 🧠 Reduce JavaScript footprint
// Tree-shake unused code
// Code split by route using React.lazy or dynamic imports
// Lazy-load non-critical components (e.g., gallery, modals)

// 🧠 CDN + Edge Caching
// Cache static assets and SSG pages at the CDN level (e.g., Cloudflare, Akamai)
// Use long-lived cache headers with cache-busting file names


// ✅ 2. Improve Data Fetching Strategy
// 🧠 Use efficient fetching tools
// Use React Query or SWR for smart caching, deduping, background updates
// Use pagination, infinite scroll, and lazy loading where applicable (not full dumps)

// Avoid N+1 API calls — batch requests where possible


// 🧠 Add server-side API caching
// API responses can be cached at reverse proxies or edge (e.g., Redis, Varnish)
// Use Cache-Control and ETag headers to reduce client-server chatter


// ✅ 3. Frontend Performance Optimization
// | Optimization                       | Impact                  |
// | ---------------------------------- | ----------------------- |
// | Compress images & serve WebP       | ⬇ First Load time       |
// | Use font-display: swap             | ⬆ Perceived performance |
// | Preload key fonts/scripts          | ⬇ LCP                   |
// | Avoid layout shifts (CLS)          | ⬆ UI stability          |
// | Minimize render-blocking resources | ⬇ TTI                   |


// ✅ 4. Monitoring & Observability
// Integrate Real User Monitoring (RUM) tools (e.g., Sentry, Datadog, SpeedCurve)
// Track Core Web Vitals (LCP, CLS, FID)
// Log frontend errors and slowness trends by geography/device/network

// ✅ 5. Progressive Enhancement & Fallbacks
// Always ship minimal HTML + functional JS for slower devices
// Gracefully degrade features like animations or large visualizations on low-end hardware

## // 🧠 Summary You Can Say in Interviews:
// To handle 5x more traffic, I’d first reduce our frontend load per user — via code splitting, CDN caching, and rendering strategy tuning. I’d use React Query for efficient data fetching and eliminate unnecessary API chatter. On the infra side, I’d work with backend to add server caching and optimize CDN delivery. Finally, I’d monitor real-world metrics using RUM tools and fine-tune UX for performance bottlenecks by geography or device type.


## // Todo problems:

// 🔍 1. Elevator Problem
// 🧠 2. Booking Overlap Problem
// Given a list of booking time slots, how do you check if a new booking overlaps with any existing one?"
// ✅ Follow-up: Can you optimize for many bookings? → Use sorted array or segment tree


// 🎯 3. You Have 8 Balls, One Is Heavier
// ❓"Using a weighing scale only 2 times, how can you find the heavier ball?"
 
// 🔢 4. Number Deduction Puzzle
// ❓"You think of a number between 1 and 100. I can ask 'Is it divisible by x?' and you answer yes/no. What's your strategy to find it in minimum questions?"

// 5.You have two ropes. Each takes exactly 60 minutes to burn, but they burn unevenly. How do you measure 45 minutes?

// 6.How many times do the hands of a clock overlap in 12 hours?

// 7.There are 3 bulbs in a room and 3 switches outside. You can enter the room only once. How do you find out which switch controls which bulb?
## // 🟢 Answer:
// Turn on switch 1 → wait 5 mins → turn off.
// Turn on switch 2.
## // Enter the room:
// Bulb that’s on → switch 2
// Bulb that’s off but warm → switch 1
// Bulb that’s off and cold → switch 3

// 8.You have a 5-liter and 3-liter jug. Measure exactly 4 liters of water.

// 9: There are 100 prisoners. The warden places either a black or white hat on each prisoner. They stand in a line and can see hats in front but not behind. One by one (starting from the back), each has to guess their own hat color. How do you maximize correct guesses?
## // 🟢 Answer:
## // Use parity:
// Last person says “black” if the number of white hats in front is even, else “white”
// Each person counts the whites ahead and deduces their own hat from previous answers.

// "In a bus with 42 seats, 6 users select the same seat number within 5 seconds. Only one can get it. What strategy ensures fairness and consistency?"

## // 🟢 Answer (Conceptual):

// Backend should implement first-write-wins with atomic lock
// Others should receive “seat unavailable” and UI shows greyed seat
// Optionally, offer “hold seat” for 60 seconds to avoid race conditions

## // ✅ Frontend must:

// Handle optimistic UI briefly
// Roll back selection if rejected


// How would you architect a frontend system that handles real-time collaboration for 10,000+ concurrent users while maintaining 60fps performance?

// 1. You’re building a real-time collaborative frontend system (e.g., like Google Docs, Figma, or a seat layout tool), supporting:

// 10,000+ concurrent users
// Updates must reflect in real time
// UI must remain responsive (~60fps)

// 🧱 2. Architectural Overview
## // 🧠 Key Principles:
// Network efficiency: Don’t push all updates to all users
// Rendering efficiency: Minimize UI work during updates
// State isolation: Avoid global re-renders
// Scalability: Efficient broadcasting and UI diffing

// 📡 3. Real-Time Communication Layer
// ✅ Use: WebSockets or WebRTC (peer-to-peer)
// All clients connect to a WebSocket server or gateway (e.g., Socket.IO, NATS, Ably)
// Each user gets events only relevant to their view (scoped topics/rooms)

## // 🔧 Optimizations:
// Room-based namespaces (e.g., per document/board/seat-layout)
// Throttled broadcasts (e.g., 20–50ms debounce)
// Use delta updates (not full state)

// 🧠 4. Data Handling Strategy
// ✅ Use: CRDT or OT (Conflict-Free Replicated Data Types)
## // Why:

// Real-time collaboration needs conflict resolution without central locking
// CRDTs allow eventual consistency and merging user actions
## // ✅ For shared cursors or small object sync, you can start with:
// { userId: 'U123', cursor: { x: 50, y: 100 }, timestamp }


// 🧠 5. Frontend State & Rendering Strategy
## // ✅ State Management:
// Use Zustand or useSyncExternalStore with subscriptions

// Keep global state minimal
// Each renderable unit (e.g., cursor, seat, sticky note) should be an independent component

## // ✅ Rendering:
// Use React.memo or virtual DOM diffing smartly
// Use Canvas/WebGL or DOM virtualization (react-window) if rendering 1000s of items
// ✅ For shared cursors or live shapes → prefer Canvas over React DOM


// 🖼️ 6. UI Performance: Maintain 60fps
## // To ensure smooth 60fps rendering:

// | Technique                                 | Benefit                        |
// | ----------------------------------------- | ------------------------------ |
// | `requestAnimationFrame`                   | Align updates to browser paint |
// | `ResizeObserver` / `IntersectionObserver` | Efficient layout monitoring    |
// | **Batch state updates**                   | Avoid cascading renders        |
// | **Idle-time processing**                  | Avoid blocking main thread     |
// | Offload heavy work to **Web Workers**     | Keep main thread clean         |
// | **Virtualize long lists or grids**        | Render only visible DOM        |

// 🛡️ 7. Security, Scaling & Failover
// | Area         | Solution                      |
// | ------------ | ----------------------------- |
// | Auth         | Token-based + role validation |
// | Rate limit   | Throttle client events        |
// | Server scale | Horizontal via pub-sub broker |
// | Failover     | Reconnect logic + resync diff |

// ✅ Final Summary (Interview-Ready)
// To support real-time collaboration for 10,000+ users with 60fps, I’d use a WebSocket-based backend with room-level broadcast control, and CRDTs or delta sync for efficient data updates. On the frontend, I’d isolate state per unit, use Zustand or useSyncExternalStore, and offload non-rendering logic to workers. To maintain 60fps, I’d virtualize heavy DOM nodes, batch renders with requestAnimationFrame, and optimize all input handling with throttling and lazy hydration.


// ✅ First: What is a Memory Leak?
## // A memory leak happens when memory that is no longer needed is not released, often due to:

// Forgotten timers
// Lingering DOM references
// Subscriptions that aren’t unsubscribed
// Detached components holding onto memory
// Over time, the app becomes slower, crashes, or exhausts memory.


// How to Prevent Memory Leaks in Frontend
// 🔁 1. Cleanup on Component Unmount
// setTimeout
// event listeners
// WebSocket connections
// Observers
// intervals

// 📡 2. Unsubscribe from Subscriptions (e.g., WebSockets, Observables)
// useEffect(() => {
//   const socket = new WebSocket(...);
//   socket.onmessage = handleMessage;

//   return () => socket.close(); // ✅ prevent leak
// }, []);

// )

// 🌲 3. Avoid Accidental Global References

// 🧹 4. Detach Detached DOM References
// If a DOM node is removed, but your code still references it — it can't be garbage collected.
// Use MutationObserver or lifecycle methods to clean these up.


// I prevent memory leaks by ensuring all subscriptions, timers, and event listeners are cleaned up on component unmount. I also avoid holding long-lived references to DOM elements or global variables. In complex apps, I track Redux/Zustand memory usage and reset state when no longer needed. For debugging, I use Chrome’s Memory tools to detect detached nodes and heap growth over time. In long-running dashboards or collaborative apps, I also periodically unload stale state or disconnect idle sockets to reduce memory footprint.


// Todo: How do you design a component library that works across multiple frameworks

// How do you handle state synchronization across browser tabs
// ✅ 1. localStorage + storage event
// Best for: Simple key/value sync (e.g., logout, auth, UI theme)
// ✅ Cross-tab
// ✅ Easy to use
// ❌ No complex data structure syncing
// ❌ Only works across same-origin tabs


// ✅ 2. BroadcastChannel API
// Best for: Structured, real-time messaging across tabs
// const channel = new BroadcastChannel('my-app');

// channel.postMessage({ type: 'SEAT_SELECTED', seatId: 'A1' });

// channel.onmessage = (e) => {
//   if (e.data.type === 'SEAT_SELECTED') {
//     // Update UI
//   }
// };

// ✅ Works across tabs, iframe, workers
// ✅ Works in modern browsers
// ❌ Not supported in Safari < 15
// ❌ No persistence (messages disappear when tab closes)


// ✅ 3. Shared Service Worker / IndexedDB
// Best for: Advanced scenarios like offline sync, queues, cache

// Use a shared Service Worker to handle events and push state to tabs

// Use IndexedDB as a persistent storage layer

// Tabs can poll or listen to shared storage changes

// ✅ Works offline
// ✅ Persistent
// ❌ Complex setup
// ❌ Requires messaging protocols (e.g., postMessage between SW and tabs)

// 🔐 What About Auth Token Sync?
## // When a user logs out in one tab:

// Broadcast "logout" via localStorage or BroadcastChannel

## // In all other tabs:
// Clear auth token
// Redirect to login page


// To sync state across browser tabs, I typically use the BroadcastChannel API for structured real-time communication, and fall back to localStorage + storage event for simpler use cases like logout or theme sync. For more persistent or offline data sharing, I use IndexedDB combined with a shared Service Worker. I ensure sensitive actions like logout or cart updates are synchronized across all open tabs to avoid stale or inconsistent user experiences.


// Session Storage 
// ❌ NOT shared across tabs
// Each tab (or tab group) gets its own isolated sessionStorage
// Refreshing the tab retains data, but opening a new tab does not

// Cookies
// ✅ Shared across all tabs (and even windows) for the same domain and path

## // Used for:
// Auth tokens (e.g., HttpOnly session cookies)
// User preferences
// No cross-tab event, though (you can't detect cookie changes like localStorage)


// | Storage Type       | Shared Across Tabs? | Triggers Sync Event? | Persistent?             |
// | ------------------ | ------------------- | -------------------- | ----------------------- |
// | **LocalStorage**   | ✅ Yes               | ✅ Yes (`storage`)    | ✅ Yes                   |
// | **SessionStorage** | ❌ No                | ❌ No                 | 🔁 Per tab only         |
// | **Cookies**        | ✅ Yes               | ❌ No                 | ✅ Depends on expiration |

// For cross-tab communication, localStorage is best due to the storage event. For short-lived, tab-scoped data, use sessionStorage. Cookies are shared across tabs but not suitable for sync logic — more for auth or SSR.

## // // In one tab:
// localStorage.setItem('logout', Date.now());

## // // In all tabs:
// window.addEventListener('storage', (e) => {
//   if (e.key === 'logout') {
//     // Handle logout
//   }
// });

// The storage event in the browser is triggered only when localStorage is modified in a different tab or window of the same origin. It does not fire in the tab that made the change.

## // ✅ Conditions for storage event to trigger:
// localStorage.setItem(), removeItem(), or clear() is called.
// The change occurs in a different tab or window of the same origin.
// The storage change actually modifies the value (e.g., setting the same key-value pair again won't trigger it).


// How do you implement smooth animations while maintaining 60fps on low-end devices?"

// To implement smooth animations at 60fps on low-end devices, you need to minimize main thread work, avoid layout thrashing, and leverage GPU acceleration. Here's a practical checklist:

// ✅ 1. Use CSS Transforms and Opacity
// Only animate transform and opacity. These don’t trigger reflow or repaint and are GPU-accelerated.

// ✅ 2. Avoid Layout Thrashing
// Minimize forced synchronous layouts (like reading .offsetHeight then writing styles).

// ✅ 3. Use requestAnimationFrame() for JS Animations
// It syncs with the browser’s refresh rate.

// function animate(timestamp) {
//   // perform updates
//   requestAnimationFrame(animate);
// }
// requestAnimationFrame(animate);

// ✅ 4. Avoid Heavy Computation in Main Thread
## // Offload to:

// Web Workers (for logic/data processing).

// setTimeout/requestIdleCallback for non-urgent tasks.

// ✅ 5. Reduce DOM Size & Complexity
// Fewer DOM nodes → Less paint/layout time.

// Use virtual scrolling/lazy rendering if many items (e.g., list views).

// ✅ 7. Throttle Expensive Events
// For scroll/resize

// What is layout thrashing?
// Layout Thrashing (also called reflow thrashing) happens when you repeatedly read and write layout-related properties of the DOM in quick succession, causing the browser to recalculate layouts multiple times per frame — killing performance and dropping frames (especially on low-end devices).


## // 🔁 Example of Layout Thrashing (❌ Bad):

// for (let i = 0; i < 100; i++) {
//   const height = element.offsetHeight; // 🔁 Forces reflow
//   element.style.height = height + 5 + 'px'; // 🔁 Modifies layout
// }
// Each .offsetHeight forces a reflow to ensure an up-to-date value.
// Each .style.height invalidates the layout.
// Browser does this 100 times, instead of once.

// ✅ Solution: Batch Reads and writes

// // Batch all reads first
// const height = element.offsetHeight;

// // Then batch writes
// for (let i = 0; i < 100; i++) {
//   elements[i].style.height = height + 5 + 'px';
// }

// Q: "How would your frontend handle 5x more users or traffic?"
## // Answer Framework:
// Bundle optimization (e.g., lazy loading, code splitting).
// Caching strategy (e.g., service workers, CDN usage).
// Virtualization for large lists (e.g., react-window, react-virtual).
// Minimize main-thread work (e.g., avoid blocking scripts).
// Preloading critical resources.

// Q: "What are common performance bottlenecks in large frontend apps?"
## // Mention:
// Layout thrashing
// Over-fetching / unbatched network requests
// Overuse of global state
// Re-render storms (caused by improper memoization)


// Q: "How would you reduce memory usage in a dashboard with lots of data?"
## // Answer Framework:

// Virtualize long lists/tables
// Debounce input-driven APIs
// Unmount unused widgets
// Fetch only partial data and page through 


// Q: "How would you show live booking updates (e.g., in a seat layout app)?"
## // Answer Framework:
// Transport: Use WebSockets or SSE for push-based updates.
## // Sync Strategy:
// Apply diffs, not full updates.
// Handle reconnection/retries.
// Optimistic UI for booking intent.

## // Conflict resolution:
// Locking seat on intent (with timeout)
// Reject stale updates (with versioning)

// Q: "How do you keep multiple tabs in sync?"
// BroadcastChannel API
// storage event on localStorage
// Shared Worker (for more advanced sync)
// IndexedDB for shared, offline-safe state

## // ⚒️ Libraries/Tools:
// Socket.io, Ably, Pusher, Firebase Realtime DB
// React Query with refetchInterval or useSubscription
// Zustand or Redux with WebSocket middleware

// ✅ Scale and Performance Bottlenecks (Frontend Focus)
// These are issues that occur when your frontend app grows in terms of users, data, complexity, or usage frequency, leading to degraded user experience (e.g., low FPS, long load time, slow interactions).


// 🔹 1. Network Bottlenecks
// 🔸 Large bundle size: Causes high initial load time.
// 🔸 Uncompressed assets: Missing gzip or Brotli.
// 🔸 Too many API calls: Especially unbatched or duplicate ones.
// 🔸 Lack of CDN usage: Static assets load slowly globally.

## // Fixes:
// Code splitting (dynamic import)
// Tree shaking
// Use CDN, cache-control headers

// 🔹 2. Rendering Bottlenecks
// 🔸 Re-render storms: Triggered by frequent state updates (e.g., setState in loops).
// 🔸 Deep component trees: Slows down diffing and rendering.
// 🔸 Unvirtualized lists: DOM bloats when rendering thousands of rows.
// 🔸 Inefficient animations: Using top, left instead of transform.

## // Fixes:
// Memoization (React.memo, useMemo, useCallback)
// Virtualized lists (react-window, react-virtual)
// Animate only transform and opacity

// 🔹 3. Memory Bottlenecks
// 🔸 Leaked references (e.g., uncleaned event listeners, timers)
// 🔸 Large in-memory caches that aren’t pruned
// 🔸 Detached DOM nodes from dynamic components

## // Fixes:
// Clean up effects (useEffect return)
// Avoid long-lived global state without eviction
// Profile memory with Chrome DevTools

// 🔹 4. Main Thread Bottlenecks
// 🔸 Heavy computation (e.g., sorting, parsing JSON, loops)
// 🔸 Blocking tasks >50ms cause frame drops

## // Fixes:
// Move work to Web Workers
// Use requestIdleCallback, requestAnimationFrame

// 🔹 5. UI Responsiveness Bottlenecks
// 🔸 Event handler delays on scroll, input
// 🔸 Synchronous data fetching or modal rendering blocking user interaction

## // Fixes:
// Debounce expensive listeners
// Use loading placeholders and suspense

// As the app scales, bottlenecks show up in rendering, network, state management, and memory. For example, we started seeing jank on our dashboard due to unvirtualized tables. We also faced stale global state causing unnecessary re-renders. We solved this by using react-window, memoization, and scoped state via Zustand. For network, we introduced pagination and React Query for better control.


// ✅ What is the MVC Pattern?
// MVC (Model-View-Controller) is a design pattern used to separate an application into three interconnected components — improving organization, maintainability, and testability.

// 🔹 1. Model
// What it does: Manages data, business logic, and state.
// Example: API calls, validation logic, data formatting.
// In frontend: Could be a service layer, Redux store, Zustand, or React Query cache.

// 🔹 2. View
// What it does: Handles the UI representation.
// Example: HTML, JSX, CSS.
// In frontend: React components, templates, or UI layer.

// 🔹 3. Controller
// What it does: Handles user input, processes it, updates the Model and View.
// Example: Event listeners, click handlers, routing logic.
// In frontend: React event handlers (onClick, onChange), form submit functions, etc

// User clicks (Controller) → Updates data (Model) → Triggers re-render (View)

## //  Sample Questions:
// "How would you design a secure login flow with JWTs?"
// "How do you prevent XSS in a React app?"

## // ✅ What to cover:
// HTTP-only cookies vs localStorage
// CSRF prevention
// Helmet/Content Security Policy
// Input sanitization and escaping


// Design a live chat UI with typing indicators and read receipts.
// ✅ 1. Requirements
## // 🎯 Functional:
// Real-time messaging between users
// Show "user is typing..." indicator
// Show message read status (e.g., ✓✓)
// Sync across tabs and devices

## // 📱 Non-functional:
// Scalable to large chat groups
// Responsive UI (mobile/web)
// Smooth performance on low-end devices

// 🧱 2. High-Level Architecture
// [ WebSocket Layer ] ⇄ [ State Management ] ⇄ [ React UI ]
//          ↑                        ↑                    ↑
//      Server Events       Zustand / Redux      ChatWindow, TypingIndicator

// 🧩 3. Components
// | Component             | Role                                   |
// | --------------------- | -------------------------------------- |
// | `<ChatWindow />`      | Shows list of messages                 |
// | `<Message />`         | One message bubble with status (✓, ✓✓) |
// | `<TypingIndicator />` | Shows "User is typing..."              |
// | `<InputBox />`        | Input + send + emit typing event       |
// | `<UserList />`        | Optional, for group typing indicators  |

// 🌐 4. Real-Time Data Flow
// 1. Sending a Message
// User types and clicks send → message sent via WebSocket

// UI shows it as “pending” until acknowledged

// 2. Receiving a Message
// WebSocket receives message event → updates UI + state

// 3. Typing Indicator
// On onChange, emit "typing" event via WebSocket with debounce (e.g., 500ms)

// Remove indicator if no event for 3–5 seconds


// 4. Read Receipts
// When a user scrolls to a message or chat is focused → emit "read" event with messageId
// Update UI accordingly on both sender and receiver


// 🧠 5. State Management
// {
//   messages: { [chatId]: Message[] },
//   typingUsers: { [chatId]: Set<userId> },
//   readStatus: { [messageId]: Set<userIds> }
// }

// ⚙️ 6. WebSocket Event Types
// | Event          | Payload                          |
// | -------------- | -------------------------------- |
// | `message:send` | `{ messageId, content, chatId }` |
// | `message:recv` | `{ messageId, sender, content }` |
// | `typing`       | `{ chatId, userId }`             |
// | `read`         | `{ chatId, messageId, userId }`  |

// 🧪 7. Edge Cases & Handling
// Out-of-order messages: Use timestamps or sequence IDs
// Typing flood: Debounce input; auto-expire typing after timeout
// Multiple tabs: Use BroadcastChannel to sync read status and input focus
// Offline support: Queue unsent messages in IndexedDB/localStorage

// 🧠 What Interviewers Look For
// Clean component-state separation
// Real-time event architecture
// Thoughtful handling of edge cases and performance
// Reasoning about debounce, sync, and state consistency

## // A/B implementation logic:
// Compute ab weights based on traffic split ;
// bucket traffic = [0.2,.5,.3] => ab weights = [0,0.2,.7,1]

// generate a random val and check if random val >=abWeights[i] && <=abWeights[i+1], if yes then assign cookie Vi and break

// So highest bucket traffic item will have highest probability of getting its corresponding cookie being set
