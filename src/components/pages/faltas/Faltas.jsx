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
import "./faltas.css";

const Faltas = () => {
  const [faltas, setFaltas] = useState([]);
  const [nuevaFaltaNombre, setNuevaFaltaNombre] = useState("");
  const [nuevaFaltaDescripcion, setNuevaFaltaDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const [faltaEditadaNombre, setFaltaEditadaNombre] = useState("");
  const [faltaEditadaDescripcion, setFaltaEditadaDescripcion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarFaltas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "faltas"));
        setFaltas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al cargar faltas: ", error);
      }
    };
    cargarFaltas();
  }, []);

  const agregarFalta = async () => {
    if (!nuevaFaltaNombre.trim() || !nuevaFaltaDescripcion.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "faltas"), {
        nombre: nuevaFaltaNombre,
        descripcion: nuevaFaltaDescripcion,
      });
      setFaltas([
        ...faltas,
        {
          id: docRef.id,
          nombre: nuevaFaltaNombre,
          descripcion: nuevaFaltaDescripcion,
        },
      ]);
      setNuevaFaltaNombre("");
      setNuevaFaltaDescripcion("");
    } catch (error) {
      console.error("Error al agregar falta: ", error);
    }
  };

  const actualizarFalta = async (id) => {
    if (!faltaEditadaNombre.trim() || !faltaEditadaDescripcion.trim()) return;
    try {
      await updateDoc(doc(db, "faltas", id), {
        nombre: faltaEditadaNombre,
        descripcion: faltaEditadaDescripcion,
      });
      setFaltas(
        faltas.map((f) =>
          f.id === id
            ? {
                ...f,
                nombre: faltaEditadaNombre,
                descripcion: faltaEditadaDescripcion,
              }
            : f
        )
      );
      setEditando(null);
      setFaltaEditadaNombre("");
      setFaltaEditadaDescripcion("");
    } catch (error) {
      console.error("Error al actualizar falta: ", error);
    }
  };

  const eliminarFalta = async (id) => {
    try {
      await deleteDoc(doc(db, "faltas", id));
      setFaltas(faltas.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Error al eliminar falta: ", error);
    }
  };

  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="container">
      <h2>Gestión de Faltas</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Nombre de la falta"
          value={nuevaFaltaNombre}
          onChange={(e) => setNuevaFaltaNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción de la falta"
          value={nuevaFaltaDescripcion}
          onChange={(e) => setNuevaFaltaDescripcion(e.target.value)}
        />
        <button onClick={agregarFalta}>Agregar</button>
      </div>
      <ul>
        {faltas.map((falta) => (
          <li key={falta.id}>
            {editando === falta.id ? (
              <>
                <input
                  type="text"
                  value={faltaEditadaNombre}
                  onChange={(e) => setFaltaEditadaNombre(e.target.value)}
                />
                <input
                  type="text"
                  value={faltaEditadaDescripcion}
                  onChange={(e) => setFaltaEditadaDescripcion(e.target.value)}
                />
                <button onClick={() => actualizarFalta(falta.id)}>
                  Guardar
                </button>
              </>
            ) : (
              <>
                <strong>{falta.nombre}</strong>: {falta.descripcion}
                <button
                  onClick={() => {
                    setEditando(falta.id);
                    setFaltaEditadaNombre(falta.nombre);
                    setFaltaEditadaDescripcion(falta.descripcion);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => eliminarFalta(falta.id)}>
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="volver-button" onClick={goToAdminDashboard}>
          Volver al Panel de Admin
        </button>
      </div>
    </div>
  );
};

export default Faltas;
