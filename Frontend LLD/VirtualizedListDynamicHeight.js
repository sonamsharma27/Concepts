import React, { useRef, useState, useCallback, useLayoutEffect } from 'react';

const BUFFER = 5; // extra items to render above/below

function VirtualizedListDynamicHeight({ items, height, renderItem }) {
    const containerRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [itemHeights, setItemHeights] = useState({});
    const itemRefs = useRef({});

    // Measure item heights after render
    useLayoutEffect(() => {
        let changed = false;
        const newHeights = { ...itemHeights };
        for (let i = 0; i < items.length; i++) {
            const ref = itemRefs.current[i];
            if (ref && ref.offsetHeight && newHeights[i] !== ref.offsetHeight) {
                newHeights[i] = ref.offsetHeight;
                changed = true;
            }
        }
        if (changed) setItemHeights(newHeights);
    });

    // Calculate positions and visible indices
    const positions = [];
    let acc = 0;
    for (let i = 0; i < items.length; i++) {
        positions[i] = acc;
        acc += itemHeights[i] || 40; // fallback to 40px if not measured yet
    }
    const totalHeight = acc;

    // Find startIndex and endIndex based on scrollTop and container height
    let startIndex = 0;
    while (
        startIndex < items.length &&
        positions[startIndex + 1] !== undefined &&
        positions[startIndex + 1] < scrollTop
    ) {
        startIndex++;
    }
    startIndex = Math.max(0, startIndex - BUFFER);

    let endIndex = startIndex;
    let visibleHeight = 0;
    while (
        endIndex < items.length &&
        visibleHeight < height + BUFFER * 40
    ) {
        visibleHeight += itemHeights[endIndex] || 40;
        endIndex++;
    }

    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            setScrollTop(containerRef.current.scrollTop);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                height,
                overflowY: 'auto',
                position: 'relative',
                border: '1px solid #ccc',
            }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                {items.slice(startIndex, endIndex).map((item, idx) => {
                    const index = startIndex + idx;
                    return (
                        <div
                            key={index}
                            ref={el => (itemRefs.current[index] = el)}
                            style={{
                                position: 'absolute',
                                top: positions[index],
                                left: 0,
                                right: 0,
                                width: '100%',
                            }}
                        >
                            {renderItem ? renderItem(item, index) : item}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default VirtualizedListDynamicHeight;