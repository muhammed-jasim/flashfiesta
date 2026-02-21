import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home.js";
import Layout from "./Layout";
import Admin from "./Pages/Admin.js";
import Printtemplate from "./Pages/Printtemplate.js";
import Signin from "./Pages/Signin.js";
import Signup from "./Pages/Signup.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="dashboard" element={<Home />} />
        <Route path="myadmin" element={<Admin />} />
        <Route path="navigation" element={<Layout />} />
        <Route path="/" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="studio" element={<Printtemplate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
