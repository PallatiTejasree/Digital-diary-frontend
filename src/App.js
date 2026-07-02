import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Reflection from "./pages/Reflection";
import Profile from "./pages/Profile";
import Archive from "./pages/Archive";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/reflection" element={<Reflection />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/archive" element={<Archive />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

