import { useState, useEffect, useContext } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { InspectorContext } from "../../pages/contexts/InspectorContext";
import { useNavigate } from "react-router-dom";

const Francos = () => {
  const navigate = useNavigate();
  const { inspector } = useContext(InspectorContext);
  const [francos, setFrancos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inspector?.legajo) {
      cargarFrancos(inspector.legajo);
    }
  }, [inspector]);

  const cargarFrancos = async (legajo) => {
    try {
      setLoading(true);
      const q = query(collection(db, "francos"), where("legajo", "==", legajo));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const francosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFrancos(francosList);
      } else {
        setFrancos([]);
      }
    } catch (error) {
      console.error("Error al obtener los francos: ", error);
      alert("Error al obtener los francos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Francos del Inspector</h1>
      {inspector ? (
        <h2>
          {inspector.nombre} {inspector.apellido} (Legajo #{inspector.legajo})
        </h2>
      ) : (
        <p>No hay inspector cargado.</p>
      )}

      {loading ? (
        <p>Cargando francos...</p>
      ) : francos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {francos.map((franco) => (
              <tr key={franco.id}>
                <td>{franco.fecha}</td>
                <td>{franco.motivo || "No especificado"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron francos registrados.</p>
      )}

      <button onClick={() => navigate("/admin-dashboard")}>
        Volver al Panel
      </button>
    </div>
  );
};

export default Francos;
