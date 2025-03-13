import { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./controles.css";

const Controles = () => {
  const [controles, setControles] = useState([]);
  const [nuevoControl, setNuevoControl] = useState("");
  const [editando, setEditando] = useState(null);
  const [controlEditado, setControlEditado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarControles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "controles"));
        setControles(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error al cargar controles: ", error);
      }
    };
    cargarControles();
  }, []);

  const agregarControl = async () => {
    if (!nuevoControl.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "controles"), {
        nombre: nuevoControl,
      });
      setControles([...controles, { id: docRef.id, nombre: nuevoControl }]);
      setNuevoControl("");
    } catch (error) {
      console.error("Error al agregar control: ", error);
    }
  };

  const actualizarControl = async (id) => {
    if (!controlEditado.trim()) return;
    try {
      await updateDoc(doc(db, "controles", id), { nombre: controlEditado });
      setControles(
        controles.map((c) =>
          c.id === id ? { ...c, nombre: controlEditado } : c
        )
      );
      setEditando(null);
      setControlEditado("");
    } catch (error) {
      console.error("Error al actualizar control: ", error);
    }
  };

  const eliminarControl = async (id) => {
    try {
      await deleteDoc(doc(db, "controles", id));
      setControles(controles.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar control: ", error);
    }
  };
  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="container">
      <h2>Gestión de Controles</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Nuevo control"
          value={nuevoControl}
          onChange={(e) => setNuevoControl(e.target.value)}
        />
        <button onClick={agregarControl}>Agregar</button>
      </div>
      <ul>
        {controles.map((control) => (
          <li key={control.id}>
            {editando === control.id ? (
              <>
                <input
                  type="text"
                  value={controlEditado}
                  onChange={(e) => setControlEditado(e.target.value)}
                />
                <button onClick={() => actualizarControl(control.id)}>
                  Guardar
                </button>
              </>
            ) : (
              <>
                {control.nombre}
                <button
                  onClick={() => {
                    setEditando(control.id);
                    setControlEditado(control.nombre);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => eliminarControl(control.id)}>
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="volver-button" onClick={goToAdminDashboard}>
          Volver al Panel de Admini
        </button>
      </div>
    </div>
  );
};

export default Controles;
