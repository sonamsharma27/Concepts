// When you animate things (like moving a box), you want your code to run right before the browser repaints the screen — that’s what requestAnimationFrame gives you.
/**
 * requestAnimationFrame(callback) tells the browser: "Hey, I have an animation frame to draw. Call this function right before you repaint."
 * 
Why not just use setTimeout or setInterval?
If you try to animate with setTimeout(..., 16) (16ms ≈ 60fps):
The callback isn’t synced with the browser’s rendering schedule.
Timing can drift → animations stutter.
Wastes CPU/GPU when the tab isn’t visible.
You manually guess the delay (16ms), but the browser may be running at 120Hz or slower due to battery saving.

requestAnimationFrame advantages:
Browser automatically matches display refresh rate.
No wasted frames when tab is inactive (it pauses automatically).
Better performance and smoother animations.

function drawFrame(timestamp) {
  console.log(timestamp); // High-res time (ms since page load)
  requestAnimationFrame(drawFrame); // schedule next frame
}

requestAnimationFrame(drawFrame);



Move a box smoothly across the screen:
<div id="box" style="width:50px;height:50px;background:red;position:absolute;"></div>

<script>
const box = document.getElementById("box");
let start = null;

function animate(timestamp) {
  if (!start) start = timestamp;
  const elapsed = timestamp - start;

  box.style.left = Math.min(elapsed / 10, 500) + "px"; // move until 500px

  if (elapsed < 5000) { // run for 5 seconds
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
</script>


Stopping an animation

requestAnimationFrame returns an ID, which can be canceled with cancelAnimationFrame:
let id = requestAnimationFrame(animate);
cancelAnimationFrame(id);

Best practices

Batch DOM reads/writes inside rAF to avoid layout thrashing.
Use CSS transforms (translate, scale) instead of top/left for smoother GPU-accelerated animations.
Don’t run heavy computations in rAF — you’ll miss frames.
Combine rAF with IntersectionObserver to run only when element is visible.

Real-world uses

Smooth scroll-based animations.
Game loops.
Progress bars or loaders.
Physics simulations.
Parallax effects.
 */

// Mind-blowing trick — polyfill

// For older browsers that don’t have rAF:

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function (cb) {
    return setTimeout(() => cb(Date.now()), 1000 / 60);
  };

window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

// Falls back to ~60fps with setTimeout.

/**
 How the browser renders a frame
Every time the browser wants to show a new frame (usually every 16.67ms at 60Hz), it runs a render pipeline:
JavaScript tasks run (event handlers, timers, promises, etc.).
Style calculation (CSS changes are processed).
Layout (positions of elements are calculated).
Paint (pixels drawn).
Composite (layers combined and sent to GPU for display).

Where setTimeout fits
setTimeout → goes into the task queue after its delay.
 */

setTimeout(() => {
  moveBox();
}, 16);

/**
 * [Frame N start]
  JS runs something heavy
[Time passes... delay met]
  Your callback is queued (NOT run immediately!)
[Next available event loop tick]
  Your callback runs — but the paint for this frame may already have happened.


Why requestAnimationFrame is different
When you call:

requestAnimationFrame(moveBox);


[Frame N start]
  Run JS tasks
  Run rAF callbacks
  Style/Layout
  Paint frame
[Frame N end]

This guarantees:

Your updates are made just in time for the next repaint.
No wasted work on invisible frames.
Perfect sync with monitor refresh rate.'

Using setTimeout (can drift)
Frame 1: Paint → (your code runs after paint) → change DOM → Wait for next paint

Using requestAnimationFrame (in sync)
Frame 1: JS → rAF → change DOM → Paint


💡 Key takeaway:
setTimeout relies on generic timers that can fire at any point in the frame cycle, often too early or too late for smooth animation.
requestAnimationFrame hooks directly into the rendering lifecycle so your changes land exactly when the browser is ready to draw.
 */



/**
 * 
 * 
 * 
 * 1. What is a Frame?

A frame in the browser is a single image that gets drawn on the screen.
When you animate something, you’re changing what’s drawn in each frame.

At 60Hz refresh rate → the screen can draw up to 60 frames per second.

That’s 1 frame every ~16.67ms.

Each frame goes through the render pipeline:

[ JS runs ] → [ Style/Layout ] → [ Paint ] → [ Composite & Display ]


If you miss a frame (your JS is too slow or runs at the wrong time), you get jank (stutter).

2. What is an Event Loop Tick?

JavaScript is single-threaded and runs inside an event loop.
An event loop tick is one cycle of processing tasks from the queue.

A single tick looks like this:

1. Pick the next task from the queue (e.g., setTimeout callback, click handler, promise resolution)
2. Run it to completion (JS runs until it finishes — no pausing mid-task)
3. When the call stack is empty, process microtasks (e.g., Promise callbacks)
4. If the browser is ready to render → perform rendering steps
5. Go back to step 1

3. How They Relate

Frames: The visual updates on screen (~60 per second at 60Hz).

Event loop ticks: The logical execution steps of JavaScript tasks.

They don’t have to line up:

Multiple ticks can happen in a single frame (if the tasks are quick).

A single tick can take so long that it blocks multiple frames (bad for animations)
 */