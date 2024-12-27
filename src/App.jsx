import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/pages/auth/Auth";
import AdminDashboard from "./components/pages/admindashboard/AdminDashboard";
import Francos from "./components/pages/francos/Francos";
import Validaciones from "./components/pages/validaciones/Validaciones";
import Informes from "./components/pages/informes/Informes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Francos" element={<Francos />} />{" "}
        <Route path="/Validaciones" element={<Validaciones />} />{" "}
        <Route path="/Informes" element={<Informes />} />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
