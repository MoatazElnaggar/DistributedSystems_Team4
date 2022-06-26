const socket = require("socket.io");
const _ = require("lodash");

//---------------------------------------------------------------------//
const PORT = process.env.PORT || 3001;
const io = socket(PORT, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://quadm-text-editor.herokuapp.com",
    ],
    methods: ["GET", "POST"],
  },
});

let docs = [
  {
    _id: "eyrghkjdfas00000000000",
    title: "Title 1",
    quillContents: "",
  },
  {
    _id: "eyrghkjdfas11111111111",
    title: "Title 2",
    quillContents: "",
  },
  {
    _id: "eyrghkjdfas22222222222",
    title: "Title 3",
    quillContents: "",
  },
  {
    _id: "eyrghkjdfas3333333333",
    title: "Title 3",
    quillContents: "",
  },
  {
    _id: "eyrghkjdfas4444444444",
    title: "Title 4",
    quillContents: "",
  },
  {
    _id: "eyrghkjdfas5555555555",
    title: "Title 5",
    quillContents: "",
  },
];
let rooms = {};
io.on("connection", (stream) => {
  //-------------------------------------------------------------------//
  stream.on("get-all-docs", async () => {
    let data = docs;
    data = data.map((d) => _.pick(d, ["_id", "title"]));
    stream.broadcast.emit("recieve-all-docs", data);
  });
  //-------------------------------------------------------------------//

  //-------------------------------------------------------------------//
  stream.on("create-new-doc", async () => {
    const doc = {
      title: "Untitled Document",
      quillContents: " ",
      _id: static++
    };
    docs.push(doc);
    console.log("Saved document:", doc);
    stream.broadcast.emit("created-new-doc", doc);
    let data = docs;
    data = data.map((d) => _.pick(d, ["_id", "title"]));
    stream.broadcast.emit("recieve-all-docs", data);
  });
  //-------------------------------------------------------------------//

  //-------------------------------------------------------------------//
  stream.on("delete-doc", async (docID) => {
    let data = docs.filter(d => d._id !== docID);
    data = data.map((d) => _.pick(d, ["_id", "title"]));
    stream.broadcast.emit("recieve-all-docs", data);
  });
  //-------------------------------------------------------------------//

  //-------------------------------------------------------------------//
  stream.on("get-doc", async (docID) => {
    stream.join(docID);
    rooms[docID] = rooms[docID] + 1 || 1;
    console.log("on join client count :", rooms[docID]);

    //this is an ES6 Set of all client ids in the room
    // console.log("rooms are:", rooms);
    //to get the number of clients in this room
    // const numClients = clients ? clients.size : 0;
    const doc = docs.find(d => d._id === docID);
    console.log(doc);
    stream.emit("load-doc", { doc, clientno: rooms[docID] });
    stream.broadcast.to(docID).emit("client-number", rooms[docID]);

    //-------------------------------------------------------------//
    stream.on("make-text-changes", ({ docID, quillContents, delta }) => {
      stream.broadcast.to(docID).emit("receive-text-changes", delta);
    });
    //-------------------------------------------------------------//
    stream.on("make-title-changes", (title) => {
      stream.broadcast.to(docID).emit("receive-title-changes", title);
    });
    //-------------------------------------------------------------//
    stream.on("save-doc", async ({ title, quillContents }) => {
      doc.title = title || "Untitled Document";
      doc.quillContents = quillContents;
      docs.push(doc);
      console.log("saved", doc);
      // stream.broadcast.to(docID).emit("saved-doc", "saved");
    });
    stream.on("disconnect", () => {
      rooms[docID] = rooms[docID] - 1 || 0;
      stream.broadcast.to(docID).emit("client-number", rooms[docID]);
    });
  });
  //-------------------------------------------------------------------//
});
