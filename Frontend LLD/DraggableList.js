import { useState } from "react";

const DraggableList = ({ initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault(); // allow drop
    if (index === draggingIndex) return;

    // Reorder items in-place (preview)
    const newItems = [...items];
    const draggedItem = newItems[draggingIndex];
    newItems.splice(draggingIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggingIndex(index);
    setItems(newItems);
  };

  const handleDrop = () => {
    setDraggingIndex(null);
  };

  return (
    <ul className="w-64 bg-gray-100 p-2 rounded-lg">
      {items.map((item, index) => (
        <li
          key={item}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={handleDrop}
          onDragEnd={handleDrop}
          className={`p-3 my-1 rounded-lg shadow cursor-move 
            ${index === draggingIndex ? "bg-blue-300" : "bg-white"}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default function DraggableListComponent() {
  return (
    <div className="flex justify-center mt-10">
      <DraggableList initialItems={["One", "Two", "Three", "Four", "Five"]} />
    </div>
  );
}
