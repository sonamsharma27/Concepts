/*
1. Different Types of Errors

First, distinguish where errors may come from:
Render-time errors → bugs in components (JS errors inside render).
Async errors → API failures, promises, async/await rejections.
Global runtime errors → unexpected errors not tied to React lifecycle (e.g., window.onerror, unhandledrejection).
Network/service errors → timeouts, offline issues.

2. React-Level Handling (UI Failures)

Use Error Boundaries to catch render-time errors in the component tree.

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Log to monitoring service
    logError(error, info);
  }
  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;
  }
}

Wrap top-level routes/pages in an ErrorBoundary.
This prevents one broken feature from taking down the whole app.
Example: a broken “Profile” page should only show a fallback there, not crash “Dashboard.”

3. Async / API Error Handling

Centralize API calls (e.g., custom fetch or Axios wrapper).
Handle errors consistently:
Retry logic for transient errors.
Graceful fallbacks (e.g., cached data, “Something went wrong” message).
Example (Axios interceptor):

axios.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) notify("Network error");
    else if (err.response.status === 401) redirectToLogin();
    logError(err);
    return Promise.reject(err);
  }
);

4. Global Runtime Errors
Capture errors outside React using browser APIs:
window.onerror = (msg, src, line, col, err) => {
  logError(err || msg);
};
window.onunhandledrejection = (e) => {
  logError(e.reason);
};

Ensures background async issues (like an unhandled Promise rejection) don’t silently fail.

5. Monitoring & Logging

Integrate with tools like Sentry, Datadog, New Relic.
Strategy:

Log all uncaught errors (from Error Boundaries + window handlers).
Include user context (route, browser, user ID if safe).
Aggregate errors → detect patterns → fix proactively.

6. User Experience Strategy

Always provide a fallback UI:
Friendly error message: “Something went wrong. Try again.”
Optionally “Report issue” or auto-report to monitoring.
Allow user to recover (reload, navigate away, retry).

7. Dev vs Prod Strategy

Dev mode → show stack traces (React error overlay, etc.).
Prod mode → show friendly fallback + log error silently.

8. Summary Strategy

Error Boundaries for render crashes (React-level).
API layer error handling for async/network issues.
Global window handlers for runtime/unhandled rejections.
Centralized logging/monitoring for visibility.
Graceful UX fallbacks so the app never hard-crashes.

✅ My answer in interview-style would be:

“At the global level, I use Error Boundaries to isolate React render crashes, a centralized API layer with consistent error handling for async issues, and global handlers (window.onerror, onunhandledrejection) for runtime errors. All of these feed into monitoring tools like Sentry, so we log context and can fix issues quickly. From a UX perspective, we always show fallback UIs so that a single failure doesn’t take down the whole SPA.”
*/



/*
Global Error Boundary in React

React introduced Error Boundaries in v16 to handle rendering errors gracefully.
They catch errors in rendering, lifecycle methods, and constructors of child components, preventing the whole app from crashing.

🔹 How Error Boundaries Work

You wrap your application (or large chunks of it) in a special component with:
static getDerivedStateFromError(error) → update state to show fallback UI
componentDidCatch(error, errorInfo) → log/report error

They don’t catch:

Event handlers (use try/catch there instead)
Async code (e.g., setTimeout, promises)
Server-side rendering (SSR)
Errors thrown inside Error Boundary itself

🔹 Example
*/

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Trigger fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    console.error("React Error:", error, errorInfo);
    // sendToSentry(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please refresh.</h2>;
    }
    return this.props.children;
  }
}

// Usage
<GlobalErrorBoundary>
  <App />
</GlobalErrorBoundary>



/*
Axios interceptors are a very powerful feature because they let you insert logic before a request is sent and after a response is received without having to repeat code everywhere. Let’s do a deep dive:

🔹 1. What are Axios Interceptors?

Interceptors are essentially middleware functions that hook into Axios’ request/response lifecycle:
Request Interceptor → runs before Axios sends the HTTP request.
Response Interceptor → runs after Axios gets the response (but before your .then() or .catch()).

🔹 2. Request Interceptors

You use them to modify requests globally.
Example use cases:

Attach auth tokens (JWT, OAuth, session IDs).
Add common headers (Content-Type, Accept).
Start a global loading spinner.
Log outgoing requests for debugging
*/


import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    // Example: attach token
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Example: add common headers
    config.headers["X-Client-Version"] = "1.0.0";

    return config; // must return config
  },
  (error) => {
    // If something went wrong before request was sent
    return Promise.reject(error);
  }
);


/**
 Response Interceptors
These run after Axios receives the response from the server.
Example use cases:
Handle global errors (401, 500).
Automatically refresh tokens if expired.
Transform response data (e.g., unwrap { data: { ... } }).
Stop a global spinner once response arrives.
 */


axios.interceptors.response.use(
  (response) => {
    // Example: unwrap API response
    return response.data; 
  },
  async (error) => {
    // Example: Handle expired token
    if (error.response && error.response.status === 401) {
      // Try refreshing token here
      // Redirect to login if refresh fails
    }

    // Handle global errors
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

/*
Axios interceptor execution order is a bit tricky:
Request interceptors → LIFO (last registered runs first).
Response interceptors → FIFO (first registered runs first).
*/

axios.interceptors.request.use(fn1);
axios.interceptors.request.use(fn2);
// fn2 runs first, then fn1


/*
Best Practices

Put interceptors in a central axios instance, not all over the app:
*/

// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

api.interceptors.request.use(/* attach token */);
api.interceptors.response.use(/* handle errors */);

export default api;

// Then in components:
import api from "./api";

api.get("/users");

//Api retries

async function fetchWithBackoff(url, retries = 3, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url);
    } catch (error) {
      if (i < retries - 1) {
        const backoff = delay * 2 ** i; // 500, 1000, 2000 ms
        await new Promise(res => setTimeout(res, backoff));
      } else {
        throw error;
      }
    }
  }
}


// ✅ Using Axios Interceptors (Global Retry Logic)

// You can hook into response errors:

import axios from "axios";

const apiInstance = axios.create();

apiInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const config = error.config;
    if (!config || config.__retryCount >= 3) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;

    const backoff = new Promise(resolve => {
      setTimeout(resolve, 1000 * config.__retryCount);
    });

    await backoff;
    return apiInstance(config); // retry request
  }
);

