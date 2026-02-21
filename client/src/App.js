import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home.js";
import Layout from "./Layout";
import Admin from "./Pages/Admin.js";
import Printtemplate from "./Pages/Printtemplate.js";
import Signin from "./Pages/Signin.js";
import Signup from "./Pages/Signup.js";
import NotFound from "./Pages/NotFound.js";
import ProtectedRoute from "./Components/ProtectedRoute.js";
import ProductDetails from "./Pages/ProductDetails.js";
import Checkout from "./Pages/Checkout.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="myadmin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="navigation" element={<Layout />} />
        <Route path="/" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="studio" element={<Printtemplate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
