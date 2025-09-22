//Global state for hooks
let hookStates = [];
let currentHookIndex = 0;

function useRef(initialValue) {
  const index = currentHookIndex;

  if (!hookStates[index]) { //This check ensures that ref value is not over writeen on rerender
    // Store an object that persists across renders
    hookStates[index] = { current: initialValue };
  }

  const ref = hookStates[index];
  currentHookIndex++;
  return ref;
}
