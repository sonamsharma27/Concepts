// Action
const increment = { type: "INCREMENT" };

// Reducer                      
function counter(state = 0, action) {
  switch (action.type) {
    case "INCREMENT": return state + 1;
    default: return state;
  }
}

// Store
const store = Redux.createStore(counter);

// Subscribe
store.subscribe(() => console.log(store.getState()));

// Dispatch
store.dispatch(increment);
