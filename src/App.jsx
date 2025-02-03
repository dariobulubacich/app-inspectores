import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/pages/auth/Auth";
import { InspectorProvider } from "./components/pages/contexts/InspectorContext";
import AdminDashboard from "./components/pages/admindashboard/AdminDashboard";
import Francos from "./components/pages/francos/Francos";
import Validaciones from "./components/pages/validaciones/Validaciones";
import Informes from "./components/pages/informes/Informes";
import Sabanas from "./components/pages/sabanas/Sabanas";
import AltaInspectores from "./components/pages/altasinspectores/AltaInspectores";

function App() {
  return (
    <BrowserRouter>
      <InspectorProvider>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/Francos" element={<Francos />} />{" "}
          <Route path="/Validaciones" element={<Validaciones />} />{" "}
          <Route path="/Informes" element={<Informes />} />{" "}
          <Route path="/Sabanas" element={<Sabanas />} />{" "}
          <Route path="/AltaInspectores" element={<AltaInspectores />} />{" "}
        </Routes>
      </InspectorProvider>
    </BrowserRouter>
  );
}

export default App;
