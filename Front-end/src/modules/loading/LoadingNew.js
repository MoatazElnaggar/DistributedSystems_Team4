import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Navigate } from "react-router-dom";
import img from "./Loading_icon.gif";

const HOST_URL = "https://quadm-text-editor-backend.herokuapp.com/";
const PASIV_HOST_URL = "https://quadm-text-editor-backend-1.herokuapp.com/";
// const HOST_URL = "http://localhost:3001";
// const PASIV_HOST_URL = "http://localhost:4000";

const LoadingNew = () => {
  const [Flag, setFlag] = useState(false);
  const [socket, setSocket] = useState();
  const [socketPasiv, setSocketPasiv] = useState();
  const [URI, setURI] = useState();

  useEffect(() => {
    let s = io(HOST_URL);
    setSocket(s);
    let psv = io(PASIV_HOST_URL);
    setSocketPasiv(psv);
    s &&
      s.on("created-new-doc", (d) => {
        setURI("/document/" + d._id);
      });
    psv &&
      psv.on("created-new-doc", (d) => {
        setURI("/document/" + d._id);
      });
  }, []);

  useEffect(() => {
    socket && socket.emit("create-new-doc");
    setInterval(() => {
      setFlag(true);
      console.log("interval 5ls");
    }, 5000);
  }, [socket]);

  useEffect(() => {
    console.log("interval 5ls w flag b :", Flag);
    Flag && socketPasiv.emit("create-new-doc");
  }, [Flag, socketPasiv]);

  return (
    <>
      <div style={{ background: "white", padding: "2em", margin: "auto" }}>
        <h1> Creating File </h1>
        <img src={img} alt="loading img" />
      </div>
      {URI && <Navigate to={URI} />}
    </>
  );
};

export default LoadingNew;
