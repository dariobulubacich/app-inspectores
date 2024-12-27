import { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./francos.css";

function AgregarJugadores() {
  const [dni, setDni] = useState("");
  const [carnet, setCarnet] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [club, setClub] = useState("");
  const [condicion, setCondicion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState("");
  const [habilitado, setHabilitado] = useState("true"); // Estado para la condición

  const navigate = useNavigate();

  // Función para buscar jugador por DNI
  const handleCheckDni = async () => {
    try {
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where("dni", "==", dni));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Swal.fire({
          title: "Jugador ya registrado",
          text: "Este DNI ya está registrado en el sistema.",
          icon: "info",
        });
        const jugador = querySnapshot.docs[0].data();
        setCarnet(jugador.carnet); // Mostrar número de carnet existente
        setNombre(jugador.nombre);
        setApellido(jugador.apellido);
        setClub(jugador.club);
        setClub(jugador.condicion);
        setCategoria(jugador.categoria);
        setNumeroCamiseta(jugador.numeroCamiseta || "");
        setHabilitado(jugador.habilitado ? "true" : "false");
      } else {
        // Obtener el último número de carnet
        const lastCarnetQuery = query(
          jugadoresRef,
          orderBy("carnet", "desc"),
          limit(1)
        );
        const lastCarnetSnapshot = await getDocs(lastCarnetQuery);

        const lastCarnetNumber = lastCarnetSnapshot.empty
          ? 0
          : parseInt(lastCarnetSnapshot.docs[0].data().carnet, 10);
        setCarnet((lastCarnetNumber + 1).toString());
        Swal.fire({
          title: "Jugador no registrado",
          text: `Se asignó automáticamente el número de carnet ${
            lastCarnetNumber + 1
          }.`,
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al buscar el jugador:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al verificar el jugador.",
        icon: "error",
      });
    }
  };

  // Función para enviar los datos a Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "jugadores"), {
        dni,
        carnet,
        nombre,
        apellido,
        club,
        categoria,
        numeroCamiseta,
        habilitado: habilitado === "true", // Guardar como booleano
      });
      Swal.fire({
        title: "Jugador agregado exitosamente",
        text: "",
        icon: "success",
      });

      // Limpiar los campos del formulario
      setDni("");
      setCarnet("");
      setNombre("");
      setApellido("");
      setClub("");
      setCondicion("");
      setCategoria("");
      setNumeroCamiseta("");
      setHabilitado("true"); // Resetear habilitado
    } catch (error) {
      console.error("Error al agregar el jugador: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo agregar el jugador.",
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
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-containers">
          <div className="div-dni">
            <input
              className="inputs-dni"
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleCheckDni}
              className="check-button"
            >
              Verificar DNI
            </button>
          </div>
          <div className="div-carnet">
            <h3>Nº Carnet:</h3>
            <input
              className="inputs-carnet"
              type="text"
              placeholder="Nº de carnet"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              required
              readOnly
            />
          </div>
          <input
            className="inputs"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="text"
            placeholder="Club"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="text"
            placeholder="Condicion"
            value={condicion}
            onChange={(e) => setCondicion(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="text"
            placeholder="Categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="number"
            placeholder="Número de camiseta (opcional)"
            value={numeroCamiseta}
            onChange={(e) => setNumeroCamiseta(e.target.value)}
          />
          <label>
            <strong>Condición:</strong>
          </label>
          <select
            className="inputs"
            value={habilitado}
            onChange={(e) => setHabilitado(e.target.value)}
          >
            <option value="true">Habilitado</option>
            <option value="false">Inhabilitado</option>
          </select>
          <div className="div-agre-client">
            <button type="submit" className="agregar-button">
              Agregar Jugador
            </button>
            <button className="volver-button" onClick={goToAdminDashboard}>
              Panel de Administrador
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AgregarJugadores;
