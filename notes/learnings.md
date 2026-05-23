# learnings

//study routing in depth 

// To redirect unauthenticated users from /home to /login, you can implement a protected route mechanism depending on the stack you're using.

/**
## * ✅ If you're using React Router v6+:
1. Create an AuthContext or use existing auth logic
(Assuming you have isAuthenticated boolean or a token)
## 2. Create a ProtectedRoute wrapper:
 */

// components/ProtectedRoute.jsx
```js
import { Navigate } from 'react-router-dom';
```

```js
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
```


```js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext'; // hypothetical context
```

```js
const App = () => {
  const { isAuthenticated } = useAuth(); // example source of auth status
```

```js
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
```

// export default App;


// Using a HOC
// utils/withAuth.jsx
```js
import { Navigate } from 'react-router-dom';
```

```js
const withAuth = (Component) => {
  return (props) => {
    const isAuthenticated = !!localStorage.getItem('token'); // your check
    return isAuthenticated ? <Component {...props} /> : <Navigate to="/login" replace />;
  };
};
```

```js
export default withAuth;
```


{/* <Navigate /> is a React Router component used to declaratively redirect the user to a different route.

## ✅ What <Navigate /> does:
It tells React Router to navigate to another path when it's rendered.

It replaces the current component with a redirect, without reloading the page.

```js
Works inside JSX and is useful for conditional navigation (e.g., auth guards, redirects after actions) */}
```

```js
import { Navigate } from "react-router-dom";
```

```js
function ProtectedPage({ isLoggedIn }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
```

```js
  return <div>Welcome to the protected page</div>;
```

```js
}
```

//   | Prop      | Description                                                               |
// | --------- | ------------------------------------------------------------------------- |
// | `to`      | (Required) The path to navigate to (`string`)                             |
// | `replace` | (Optional) If true, replaces current history entry instead of pushing new |
// | `state`   | (Optional) Passes custom state to the target location                     |


// Difference between cookieStore, localStorage,
// Is SSR good for users with slow internet 


/**
 * var a = {};
```js
(function b(a) {
 a.a = 10;
 a = null;
})(a);
```

```js
console.log(a);
 * 
 */
```

// what is requestIdleCallback
// req

//no of images is high on a page, still they are loading very fast. How?  progressive rendering 
//how web workers internally work?
//when to use SSR. when not to
//Positions in CSS,
//Px, rem, em, etc in CSS
//whats new in react 19. whats different

Array.prototype.splice(start, deleteCount, ...itemsToInsert)


## // 👉 In performance tuning:
// Prefer animations that only affect composite layers (transform, opacity).
// Avoid frequent paint-heavy changes (like box-shadow, border-radius, background-color) in animations.


//GitHub → Jenkins → Docker build → Push to AWS ECR → Deploy to ECS/EKS/EC2 → Users
