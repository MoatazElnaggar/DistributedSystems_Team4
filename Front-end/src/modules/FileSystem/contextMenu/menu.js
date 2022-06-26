import React from "react";
import useContextMenu from "./useContextMenu";

const Menu = ({ outerRef, handleDelete, handleRename }) => {
  const { xPos, yPos, menu } = useContextMenu(outerRef);

  if (menu) {
    return (
      <div
        className="contextMenu contextMenuItemRed"
        style={{ top: yPos, left: xPos }}
      >
        <div className="contextMenuItem " onClick={() => handleDelete()}>
          Delete
        </div>
      </div>
    );
  }
  return <></>;
};

export default Menu;
