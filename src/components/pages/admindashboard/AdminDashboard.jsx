import { useState, useContext, useEffect, useCallback } from "react";
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

  // Función para buscar inspector en Firebase
  const cargarInspector = useCallback(async () => {
    if (!legajo) return; // Evitar llamadas innecesarias
    try {
      setLoading(true);
      const q = query(
        collection(db, "inspectores"),
        where("legajo", "==", legajo)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const inspectorData = querySnapshot.docs[0].data();
        setInspector({
          legajo: inspectorData.legajo,
          nombre: inspectorData.nombre,
          apellido: inspectorData.apellido,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [legajo, setInspector]);

  // Ejecutar cargarInspector automáticamente cuando cambia legajo
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      cargarInspector();
    }, 3000); // Agrega un pequeño retraso para evitar llamadas excesivas

    return () => clearTimeout(delayDebounce); // Limpiar el timeout si el usuario sigue escribiendo
  }, [legajo, cargarInspector]);

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
        {loading && <p>Cargando...</p>}
        {inspector && (
          <div>
            <p>
              Inspector cargado: {inspector.nombre} {inspector.apellido} (
              {inspector.legajo})
            </p>
          </div>
        )}
      </div>

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
          <li>
            <button onClick={() => navigate("/AltaFrancos")}>
              Altas Francos
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/InformesInspector")}>
              Informes Inspectores
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/Controles")}>
              Alta y Modificación Controles
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/Faltas")}>
              Alta y Modificación Faltas
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
