// State storage
let hookStates = [];
let currentComponent = null;
let currentHookIndex = 0;

// Core useState function
function useState(initialValue) {
  const hookIndex = currentHookIndex;

  // Initialize state if not already present
  if (hookStates[hookIndex] === undefined) {
    hookStates[hookIndex] = initialValue;
  }

  // Custom setState function
  function setState(newValue) {
    hookStates[hookIndex] = newValue;
    render(currentComponent); // Trigger re-render
  }

  currentHookIndex++;
  return [hookStates[hookIndex], setState];
}



//Render function will be called when the component is first rendered (app starts) and whenever the state changes.
function render(component) {
    currentComponent = component;
    currentHookIndex = 0; // Reset hook index for the new render
    component(); // Call the component function to render it
}

/**
 * ✅ Purpose: currentHookIndex = 0; 
This resets the hook index counter to 0 every time the component re-renders.
React (and our simulation) relies on the order of hook calls in each render to keep track of the correct state value. Since useState doesn’t use names or keys, it uses position-based indexing to know which piece of state to return.
 */


