/**
 * const value = useContext(MyContext);
It reads the value from the nearest <MyContext.Provider> up the tree.
Returns the current context value.
Does not trigger re-renders unless the provider value changes.
Under the hood, React relies on a global context mapping & fiber tree traversal.

🔧 Simulating createContext and useContext
We'll need:
1. A createContext() function that creates a context with a default value
2. A way to simulate a Provider
3. A useContext() that reads the current context value from the active provider


✅ Step-by-Step Implementation
*/
function createContext(defaultValue) {
  const context = {
    value: defaultValue,
    Provider: function Provider(newValue, children) {
      context.value = newValue;
      return children(); // simulating JSX rendering of children
    },
    Consumer: function Consumer(cb) {
      return cb(context.value); // simulating render prop pattern
    }
  };
  return context;
}


function useContext(Context) {
  return Context.value;
}



// 🔁 Enhancing This with Scoped Context (Optional)

const contextStack = new Map();

function createContext(defaultValue) {
  const contextId = Symbol("context");
  contextStack.set(contextId, [defaultValue]);

  return {
    Provider(value, children) {
      const stack = contextStack.get(contextId);
      stack.push(value);
      const result = children(); // simulate children rendering
      stack.pop();
      return result;
    },
    use() {
      const stack = contextStack.get(contextId);
      return stack[stack.length - 1];
    }
  };
}


 


