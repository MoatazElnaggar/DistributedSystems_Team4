import React from "react";
import img from "./Add.svg";

const NewFile = () => {
  const docURI = `/document/new`;
  return (
    <a href={docURI}>
      <div className="fileContainer filebox">
        <div className="fileimg">
          <img src={img} alt="fileimg" />
        </div>
        <p>New File</p>
      </div>
    </a>
  );
};

export default NewFile;
