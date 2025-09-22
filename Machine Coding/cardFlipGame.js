import { useRef, useState, useCallback, memo } from "react";

const Grid = ({ data, setScore, N }) => {
  const totalCells = N * N;
  const lastClickedRef = useRef(null); // store first selected tile
  const [identified, setIdentified] = useState(Array(totalCells).fill(false));
  const [clicked, setClicked] = useState(Array(totalCells).fill(false));

  const onClick = useCallback(
    (index) => {
      // Already matched or already clicked
      if (identified[index] || clicked[index]) return;

      const currentId = data[index]?.id;
      setClicked((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });

      // First click in pair
      if (lastClickedRef.current === null) {
        lastClickedRef.current = { index, id: currentId };
        return;
      }

      // Second click in pair
      if (lastClickedRef.current.id === currentId) {
        // Match found
        setScore((prev) => prev + 1);
        setIdentified((prev) => {
          const updated = [...prev];
          updated[index] = true;
          updated[lastClickedRef.current.index] = true;
          return updated;
        });
      } else {
        // No match — hide both after delay
        const prevIndex = lastClickedRef.current.index;
        setTimeout(() => {
          setClicked((prev) => {
            const updated = [...prev];
            updated[index] = false;
            updated[prevIndex] = false;
            return updated;
          });
        }, 1000);
      }

      lastClickedRef.current = null; // reset for next pair
    },
    [data, identified, clicked, setScore]
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, auto)`, gap: "8px" }}>
      {data.map(({ id, download_url }, index) => {
        const showImage = identified[index] || clicked[index];
        return (
          <div
            key={index} // index is safe here because data order is stable
            onClick={() => onClick(index)}
            role="button"
            tabIndex={0}
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "#f0f0f0"
            }}
          >
            {showImage ? (
              <img
                src={download_url}
                alt={`tile-${id}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span>Click me</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(Grid);
