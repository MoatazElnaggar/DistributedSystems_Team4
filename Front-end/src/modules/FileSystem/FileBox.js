import React, { useRef } from "react";
import Menu from "./contextMenu/menu";
import img from "./stories-icon.svg";
import "./style.css";

const FileBox = ({ file, handleDelete, handleRename }) => {
  const docURI = `/document/${file._id}`;
  const fileref = useRef(null);

  return (
    <div ref={fileref}>
      <a className="fileContainer filebox" href={docURI}>
        <div className="fileimg">
          <img src={img} alt="fileimg" />
        </div>
        <p>
          {file.title.length > 10
            ? file.title.slice(0, 10) + "..."
            : file.title}
        </p>
      </a>

      <Menu
        outerRef={fileref}
        style={{ zIndex: 1 }}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FileBox;
