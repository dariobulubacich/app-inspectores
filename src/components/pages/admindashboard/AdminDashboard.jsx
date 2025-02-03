import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { InspectorContext } from "../../pages/contexts/InspectorContext";
import "./admindashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { inspector, setInspector } = useContext(InspectorContext);
  const [legajo, setLegajo] = useState("");
  const [loading, setLoading] = useState(false);

  // Buscar inspector en Firebase
  const cargarInspector = async () => {
    try {
      setLoading(true);
      console.log("Número ingresado:", legajo);
      const q = query(
        collection(db, "inspectores"),
        where("legajo", "==", legajo)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const inspectorData = querySnapshot.docs[0].data();
        console.log("Inspector encontrado:", inspectorData);
        setInspector({
          legajo: inspectorData.legajo,
          nombre: inspectorData.nombre,
          apellido: inspectorData.apellido,
        });
        alert("Inspector cargado correctamente.");
      } else {
        console.log("No se encontró un inspector con el número:", legajo);
        alert("No se encontró un inspector con ese número.");
      }
    } catch (error) {
      console.error("Error al cargar el inspector: ", error);
      alert("Error al cargar el inspector.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Panel de administrador</h1>

      <div>
        <h2>Cargar inspector</h2>
        <input
          type="text"
          placeholder="Número de inspector"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
          disabled={loading}
        />
        <button onClick={cargarInspector} disabled={loading || !legajo}>
          {loading ? "Cargando..." : "Cargar Inspector"}
        </button>
        {inspector && (
          <div>
            <p>
              Inspector cargado: {inspector.nombre} {inspector.apellido} (#
              {inspector.numero})
            </p>
          </div>
        )}
      </div>

      <div>
        <nav>
          <ul className="ul-nav">
            <li>
              <button onClick={() => navigate("/Informes")}>Informes</button>
            </li>
            <li>
              <button onClick={() => navigate("/Validaciones")}>
                Validaciones
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/Francos")}>Francos</button>
            </li>
            <li>
              <button onClick={() => navigate("/Sabanas")}>Sabanas</button>
            </li>
            <li>
              <button onClick={() => navigate("/AltaInspectores")}>
                Altas Inspectores
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
