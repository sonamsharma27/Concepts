let hookStates = [];
let currentHookIndex = 0;
let pendingEffects = [];

function useEffect(callback, deps) {
  const index = currentHookIndex;
  const prev = hookStates[index];

  const hasChanged = !prev || deps.some((dep, i) => dep !== prev.deps[i]);

  if (hasChanged) {
    // Queue effect to run after render
    pendingEffects.push({
      index,
      callback,
    });

    // Store deps now, cleanup will be handled after effect
    hookStates[index] = { deps, cleanup: prev?.cleanup };
  }

  currentHookIndex++;
}

function render(Component) {
  currentHookIndex = 0;
  pendingEffects = [];
  Component(); //Call component → inside it, `useEffect` will populate `pendingEffects`
  // ✅ Commit phase
  pendingEffects.forEach(({ index, callback }) => {
    // Cleanup previous effect if it exist
    const prevEffect = hookStates[index];
    if (typeof prevEffect.cleanup === 'function') {
      prevEffect.cleanup();
    }

    const cleanup = callback(); // Run current effect
    if (typeof cleanup === 'function') {
      hookStates[index].cleanup = cleanup;
    }
  });
}
