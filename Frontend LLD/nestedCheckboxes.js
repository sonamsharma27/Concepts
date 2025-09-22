import { useState } from "react";
import Checkbox from "./Checkbox";
import checkboxData from "./data";

const NestedCheckboxes = () => {
  const [data, setData] = useState({});

  const getChildIds = (node, ids = []) => {
    ids.push(node.id);
    node?.children?.forEach((child) => getChildIds(child, ids));
    return ids;
  };

  const updateChildren = (node, e) => {
    const checked = e.target.checked;
    const childIds = getChildIds(node);
    const checkedState = { ...data };
    childIds.forEach((id) => (checkedState[id] = checked));
    return checkedState;
  };
  const updateparent = (data, checkedState) => {
    data.forEach((node) => {
      if (node.children) {
        updateparent(node.children, checkedState);
        checkedState[node.id] = node.children.every(
          (child) => checkedState[child.id]
        );
      }
    });
    return checkedState;
  };
  const handleClick = (node, e) => {
    let updatedCheckedState = updateChildren(node, e);
    updatedCheckedState = updateparent(checkboxData, updatedCheckedState);
    setData(updatedCheckedState);
  };
  return (
    <div>
      {checkboxData.map((box) => (
        <Checkbox
          key={box.id}
          data={box}
          handleClick={handleClick}
          checkedState={data}
        />
      ))}
    </div>
  );
};

export default NestedCheckboxes;
