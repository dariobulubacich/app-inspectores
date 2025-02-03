import { useState, useEffect, useContext } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { InspectorContext } from "../../pages/contexts/InspectorContext";
import "./informes.css";

const Informe = () => {
  const [fecha, setFecha] = useState("");
  const [legajo, setLegajo] = useState("");
  const [apellidoNombre, setApellidoNombre] = useState("");
  const [linea, setLinea] = useState("");
  const [sector, setSector] = useState("");
  const [horaReal, setHoraReal] = useState("");
  const [horaTeorica, setHoraTeorica] = useState("");
  const [servicio, setServicio] = useState("");
  const [interno, setInterno] = useState("");
  const [interseccion, setInterseccion] = useState("");
  const [detalleFalta, setDetalleFalta] = useState("");
  const [lineas, setLineas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const condicion = ["Sí", "No"];
  const [auricular, setAuricular] = useState("");
  const [matafuego, setMatafuego] = useState("");
  const [celular, setCelular] = useState("");
  const [cinturon, setCinturon] = useState("");
  const [loading, setLoading] = useState(false);

  const { inspector } = useContext(InspectorContext); // Obtener información del inspector desde el contexto

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const lineasSnapshot = await getDocs(collection(db, "lineas"));
        const lineasData = lineasSnapshot.docs.map((doc) => doc.data().nombre);
        setLineas(lineasData);

        const sectoresSnapshot = await getDocs(collection(db, "sectores"));
        const sectoresData = sectoresSnapshot.docs.map(
          (doc) => doc.data().nombre
        );
        setSectores(sectoresData);
      } catch (error) {
        console.error("Error al cargar líneas y sectores: ", error);
        alert("Error al cargar líneas y sectores.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const buscarApellidoNombre = async () => {
    if (!legajo) {
      alert("Por favor, ingresa un legajo válido.");
      return;
    }

    try {
      setLoading(true);
      const q = query(
        collection(db, "empleados"),
        where("legajo", "==", legajo)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const empleado = querySnapshot.docs[0].data();
        setApellidoNombre(`${empleado.apellido}, ${empleado.nombre}`);
      } else {
        alert("No se encontró un empleado con el legajo ingresado.");
        setApellidoNombre("");
      }
    } catch (error) {
      console.error("Error al buscar empleado: ", error);
      alert("Ocurrió un error al buscar el empleado.");
    } finally {
      setLoading(false);
    }
  };

  const guardarInforme = async () => {
    if (
      !fecha ||
      !legajo ||
      !linea ||
      !sector ||
      !horaReal ||
      !horaTeorica ||
      !servicio ||
      !interno ||
      !interseccion ||
      !detalleFalta ||
      !auricular ||
      !matafuego ||
      !celular ||
      !cinturon
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!inspector) {
      alert("No se ha cargado un inspector. Por favor, verifica.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "informes"), {
        fecha,
        legajo,
        apellidoNombre,
        linea,
        sector,
        horaReal,
        horaTeorica,
        servicio,
        interno,
        interseccion,
        detalleFalta,
        auricular,
        matafuego,
        celular,
        cinturon,
        inspector: {
          numero: inspector.numero,
          nombre: inspector.nombre,
          apellido: inspector.apellido,
        },
        timestamp: new Date().toISOString(),
      });

      alert("Informe guardado correctamente.");
      setFecha("");
      setLegajo("");
      setApellidoNombre("");
      setLinea("");
      setSector("");
      setHoraReal("");
      setHoraTeorica("");
      setServicio("");
      setInterno("");
      setInterseccion("");
      setDetalleFalta("");
      setAuricular("");
      setMatafuego("");
      setCelular("");
      setCinturon("");
    } catch (error) {
      console.error("Error al guardar el informe: ", error);
      alert("Ocurrió un error al guardar el informe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Informe</h1>

      <div className="form-group">
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Legajo:</label>
        <input
          type="text"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={buscarApellidoNombre}
          disabled={loading || !legajo}
          className="btn"
        >
          {loading ? "Buscando..." : "Buscar Nombre"}
        </button>
      </div>

      {apellidoNombre && (
        <div className="form-group">
          <label>Apellido y Nombre:</label>
          <input type="text" value={apellidoNombre} readOnly />
        </div>
      )}

      <div className="form-group">
        <label>Línea:</label>
        <select
          value={linea}
          onChange={(e) => setLinea(e.target.value)}
          disabled={loading}
        >
          <option value="">Seleccionar Línea</option>
          {lineas.map((linea, index) => (
            <option key={index} value={linea}>
              {linea}
            </option>
          ))}
        </select>

        <label>Sector:</label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          disabled={loading}
        >
          <option value="">Seleccionar Sector</option>
          {sectores.map((sector, index) => (
            <option key={index} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Servicio:</label>
        <input
          type="text"
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          disabled={loading}
        />

        <label>Interno:</label>
        <input
          type="text"
          value={interno}
          onChange={(e) => setInterno(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label>Intersección Alternativa:</label>
        <input
          type="text"
          value={interseccion}
          onChange={(e) => setInterseccion(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Hora Real de Paso:</label>
        <input
          type="time"
          value={horaReal}
          onChange={(e) => setHoraReal(e.target.value)}
          disabled={loading}
        />

        <label>Hora Teórica de Paso:</label>
        <input
          type="time"
          value={horaTeorica}
          onChange={(e) => setHoraTeorica(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <textarea
          value={detalleFalta}
          placeholder="Detalle de la falta"
          onChange={(e) => setDetalleFalta(e.target.value)}
          disabled={loading}
          rows="4"
        ></textarea>
      </div>
      <div>
        <label>Control:</label>
      </div>

      <div className="form-group">
        <label>Auricular:</label>
        <select
          value={auricular}
          onChange={(e) => setAuricular(e.target.value)}
        >
          <option value="">Seleccionar</option>
          {condicion.map((cond, index) => (
            <option key={index} value={cond}>
              {cond}
            </option>
          ))}
        </select>

        <label>Matafuego:</label>
        <select
          value={matafuego}
          onChange={(e) => setMatafuego(e.target.value)}
        >
          <option value="">Seleccionar</option>
          {condicion.length > 0 &&
            condicion.map((cond, index) => (
              <option key={index} value={cond}>
                {cond}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label>Celular:</label>
        <select value={celular} onChange={(e) => setCelular(e.target.value)}>
          <option value="">Seleccionar</option>
          {condicion.length > 0 &&
            condicion.map((cond, index) => (
              <option key={index} value={cond}>
                {cond}
              </option>
            ))}
        </select>

        <label>Cinturón:</label>
        <select value={cinturon} onChange={(e) => setCinturon(e.target.value)}>
          <option value="" className="select-var">
            Seleccionar
          </option>
          {condicion.length > 0 &&
            condicion.map((cond, index) => (
              <option key={index} value={cond}>
                {cond}
              </option>
            ))}
        </select>
      </div>

      <button onClick={guardarInforme} disabled={loading}>
        {loading ? "Guardando..." : "Guardar Informe"}
      </button>
    </div>
  );
};

export default Informe;
