import React, { useState, useEffect } from "react";
import "./style.css";
import FileBox from "./FileBox.js";
import NewFile from "./NewFile.js";
import { io } from "socket.io-client";

const HOST_URL = "https://quadm-text-editor-backend.herokuapp.com/";
const PASIV_HOST_URL = "https://quadm-text-editor-backend-1.herokuapp.com/";
// const HOST_URL = "http://localhost:3001";
// const PASIV_HOST_URL = "http://localhost:4000";

const MyFileSystem = () => {
  const [files, setFiles] = useState([]);
  const [socket, setSocket] = useState();
  const [socketPasiv, setSocketPasiv] = useState();

  const handleDelete = (file) => {
    if (window.confirm(`Are you sure to delete ${file.title} document?`)) {
      console.log("successfully deleted document, id: ", file._id);
      setFiles(files.filter((f) => f._id !== file._id));
      socket.emit("delete-doc", file._id);
    } else return;
  };

  useEffect(() => {
    const s = io(HOST_URL);
    const psv = io(PASIV_HOST_URL);
    setSocket(s);
    setSocketPasiv(psv);
    s.emit("get-all-docs");
    psv.emit("get-all-docs");
  }, []);

  useEffect(() => {
    let fils;
    socket &&
      socket.on("recieve-all-docs", (f) => {
        fils = f;
        console.log(f);
        setFiles(f);
      });

    if (!fils)
      socketPasiv &&
        socketPasiv.on("recieve-all-docs", (f) => {
          console.log(f);
          console.log("here in pasive");
          setFiles(f);
          fils = f;
        });
  }, [socket, files, socketPasiv]);

  useEffect(() => {
    if (!files) {
      socket && socket.emit("get-all-docs");
      socketPasiv && socketPasiv.emit("get-all-docs");
    }
  }, [files, socket, socketPasiv]);

  return (
    <div className="fileSystem">
      {files &&
        files.map((f) => (
          <FileBox file={f} key={f._id} handleDelete={() => handleDelete(f)} />
        ))}
      {<NewFile />}
    </div>
  );
};

export default MyFileSystem;
