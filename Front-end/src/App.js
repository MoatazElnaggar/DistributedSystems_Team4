import "quill/dist/quill.snow.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TextEditor from "./modules/TextEditor/index";
import MyFileSystem from "./modules/FileSystem";
import LoadingNew from "./modules/loading/LoadingNew";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MyFileSystem />} />
          <Route path="/document/new" element={<LoadingNew />} exact></Route>
          <Route path="/document/:id" element={<TextEditor />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
