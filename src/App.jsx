import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/pages/auth/Auth";
import { InspectorProvider } from "./components/pages/contexts/InspectorContext";
import AdminDashboard from "./components/pages/admindashboard/AdminDashboard";
import Validaciones from "./components/pages/validaciones/Validaciones";
import Informes from "./components/pages/informes/Informes";
import Sabanas from "./components/pages/sabanas/Sabanas";
import AltaInspectores from "./components/pages/altasinspectores/AltaInspectores";
import Francos from "./components/pages/francos/Francos";
import AltaFrancos from "./components/pages/altasfrancos/AltaFrancos";
import InformesInspector from "./components/pages/informesinspector/InformesInspector";
import Controles from "./components/pages/controles/Controles";
import Faltas from "./components/pages/faltas/Faltas";

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
          <Route path="/AltaFrancos" element={<AltaFrancos />} />{" "}
          <Route path="/InformesInspector" element={<InformesInspector />} />{" "}
          <Route path="/Controles" element={<Controles />} />{" "}
          <Route path="/Faltas" element={<Faltas />} />{" "}
        </Routes>
      </InspectorProvider>
    </BrowserRouter>
  );
}

export default App;
