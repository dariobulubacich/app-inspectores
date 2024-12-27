import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function BuscarModificarJugadores() {
  const [carnet, setCarnet] = useState("");
  const [jugador, setJugador] = useState(null);
  const [habilitado, setHabilitado] = useState("");
  const navigate = useNavigate();

  // Función para buscar jugador por carnet
  const handleBuscar = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        collection(db, "jugadores"),
        where("carnet", "==", carnet)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire({
          title: "Jugador no encontrado",
          text: "No se encontró ningún jugador con ese carnet.",
          icon: "error",
        });
        setJugador(null);
      } else {
        const jugadorData = querySnapshot.docs[0];
        setJugador({ id: jugadorData.id, ...jugadorData.data() });
        setHabilitado(jugadorData.data().habilitado ? "true" : "false"); // Convertir a string para el select
      }
    } catch (error) {
      console.error("Error al buscar el jugador: ", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al buscar el jugador.",
        icon: "error",
      });
    }
  };

  // Función para actualizar la condición del jugador
  const handleModificar = async () => {
    if (!jugador) return;

    try {
      const jugadorRef = doc(db, "jugadores", jugador.id);
      const nuevoEstado = habilitado === "true"; // Convertir de string a booleano
      await updateDoc(jugadorRef, { habilitado: nuevoEstado });

      Swal.fire({
        title: "Jugador actualizado",
        text: `El jugador ha sido ${
          nuevoEstado ? "habilitado" : "inhabilitado"
        } exitosamente.`,
        icon: "success",
      });

      setJugador(null);
      setCarnet("");
      setHabilitado("");
    } catch (error) {
      console.error("Error al actualizar el jugador: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el jugador.",
        icon: "error",
      });
    }
  };

  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div>
      <h1>Buscar y Modificar Jugador</h1>
      <form className="form" onSubmit={handleBuscar}>
        <div className="form-containers">
          <input
            className="inputs"
            type="text"
            placeholder="Nº de carnet"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            required
          />
          <button type="submit" className="buscar-button">
            Buscar Jugador
          </button>
        </div>
      </form>

      {jugador && (
        <div className="jugador-info">
          <h3>Información del jugador:</h3>
          <p>
            <strong>Condición:</strong> {jugador.condicion}
            {/* Campo agregado */}
          </p>
          <p>
            <strong>Nombre:</strong> {jugador.nombre}
          </p>
          <p>
            <strong>Apellido:</strong> {jugador.apellido}
          </p>
          <p>
            <strong>Club:</strong> {jugador.club}
          </p>
          <div className="modificar-container">
            <label>
              <strong>Modificar condición:</strong>
            </label>
            <select
              value={habilitado}
              onChange={(e) => setHabilitado(e.target.value)}
              className="select-condicion"
            >
              <option value="true">Habilitado</option>
              <option value="false">Inhabilitado</option>
            </select>
            <button onClick={handleModificar} className="modificar-button">
              Guardar Cambios
            </button>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button className="volver-button" onClick={goToAdminDashboard}>
                Volver al Panel de Administrador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuscarModificarJugadores;
