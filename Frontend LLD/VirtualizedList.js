import React, { useRef, useState, useCallback } from "react";

// Height of each item
const ITEM_HEIGHT = 40; // px
// Number of extra items to render above and below the visible area for smoother scrolling
const BUFFER = 5; // extra items to render above/below

function VirtualizedList({ items, height }) {
  // Ref to the scrollable container div
  const containerRef = useRef(null);
  // State to keep track of the current scroll position
  const [scrollTop, setScrollTop] = useState(0);

  // Total height of all items combined
  const totalHeight = items.length * ITEM_HEIGHT;
  // Number of items that can fit in the visible area
  const visibleCount = Math.ceil(height / ITEM_HEIGHT);

  // Handler for scroll event to update scrollTop state
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Calculate the index of the first item to render (with buffer)
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
  // Calculate the index of the last item to render (with buffer)
  const endIndex = Math.min(
    items.length,
    startIndex + visibleCount + 2 * BUFFER
  );

  // Offset for positioning the rendered items within the container
  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <div
      ref={containerRef}
      style={{
        height, // Fixed height for the scrollable area
        overflowY: "auto", // Enable vertical scrolling
        position: "relative",
        border: "1px solid #ccc",
      }}
      onScroll={handleScroll} // Attach scroll handler
    >
      {/* Outer div with total height to enable correct scrollbar */}
      <div style={{ height: totalHeight, position: "relative" }}>
        {/* Inner div positioned to show only the visible items */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            left: 0,
            right: 0,
          }}
        >
          {/* Render only the visible items plus buffer */}
          {items.slice(startIndex, endIndex).map((item, idx) => (
            <div
              key={startIndex + idx}
              style={{
                height: ITEM_HEIGHT,
                boxSizing: "border-box",
                borderBottom: "1px solid #eee",
                padding: "8px",
                background: (startIndex + idx) % 2 === 0 ? "#fafafa" : "#fff",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualizedList;

/**
 * 
 * 1. How top works
When you change an element’s top value:

The browser must recalculate layout for that element and potentially its siblings (layout/reflow step).
This may trigger paint and compositing phases.
If the list is large or complex, this extra layout work can cause visible jank during fast scrolls.

Example in your case:
Every time offsetY changes, setting top: offsetY forces the browser to reflow the list container, because top affects document flow calculations (even for absolutely positioned elements).

2. How transform: translateY works
When you use transform: translateY(offsetY):
The browser does not recalculate layout — it just moves the pixels that have already been rendered.
This uses the compositing stage only (handled by the GPU).
Transform changes are cheaper because the browser skips layout and paint for the moved element — it just shifts a bitmap in GPU memory.
This is why animations or scrolling offsets using transform tend to be smoother — they avoid expensive main-thread layout recalculations.

3. Practical performance difference
top → Layout + Paint + Composite
transform: translateY → Composite only
On a virtualization-heavy page (like your seat layout or a massive table), avoiding layout recalculations is critical for maintaining 60fps scroll performance.

4. Caveats
transform creates a new stacking context (z-index behavior may differ).

transform is visually applied, so the DOM element’s “real” position in the document flow doesn’t change — this usually doesn’t matter for virtualization since you’re manually positioning everything.

💡 Rule of thumb for virtualization:
If you’re moving an entire block of already-laid-out elements just to position them, use transform: translateY.
If you’re changing where the element “lives” in layout flow relative to others, use top.


 */

/**
 * 
 The offset (offsetY = startIndex * ITEM_HEIGHT) creates empty space above the visible items so that:
The scrollbar position matches the user’s scroll location.
The items appear in the correct vertical position relative to the full list.

Without offset → broken experience
✅ Scrollbar moves
❌ Items always drawn at the top (incorrect position)
❌ Illusion of a continuous list breaks

With offset → correct virtualization
✅ Scrollbar moves
✅ Items drawn at the correct vertical position
✅ Illusion of a continuous list is maintained
*
*/
