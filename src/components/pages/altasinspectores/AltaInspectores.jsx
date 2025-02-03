import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Ajusta la ruta según tu estructura
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import "./altaInspectores.css";

const AltaInspectores = () => {
  const [legajo, setLegajo] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!legajo || !nombre || !apellido) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      setLoading(true);
      // Guardar en Firebase
      await addDoc(collection(db, "inspectores"), {
        legajo,
        nombre,
        apellido,
      });

      Swal.fire("Éxito", "Inspector dado de alta correctamente", "success");

      // Limpiar el formulario
      setLegajo("");
      setNombre("");
      setApellido("");
    } catch (error) {
      console.error("Error al guardar el inspector: ", error);
      Swal.fire("Error", "No se pudo guardar el inspector", "error");
    } finally {
      setLoading(false);
    }
  };
  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <Grid container={true}>
      <Grid style={{ padding: "12rem" }} size={{ xs: 12 }}>
        <div className="alta-inspectores-container">
          <h1>Dar de Alta Inspector</h1>
          <form className="form-alta-inspectores" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Legajo"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Dar de Alta"}
            </button>
          </form>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="volver-button" onClick={goToAdminDashboard}>
            Volver al Panel de Admini
          </button>
        </div>
      </Grid>
    </Grid>
  );
};

export default AltaInspectores;
