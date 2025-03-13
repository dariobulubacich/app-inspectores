import { useState, useEffect, useContext, useCallback, useRef } from "react";
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
  const [auricular, setAuricular] = useState("");
  const [matafuego, setMatafuego] = useState("");
  const [celular, setCelular] = useState("");
  const [cinturon, setCinturon] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalInforme, setModalInforme] = useState(false);
  const [modalControl, setModalControl] = useState(false);
  const [faltas, setFaltas] = useState([]);
  const [controles, setControles] = useState([]);
  const [informeChecks, setInformeChecks] = useState({});
  const [controlChecks, setControlChecks] = useState({});
  const [observaciones, setObservaciones] = useState("");

  const { inspector } = useContext(InspectorContext); // Obtener información del inspector desde el contexto
  const timerRef = useRef(null); // useRef para almacenar el timer sin causar re-renders

  useEffect(() => {
    const cargarDatosModal = async () => {
      try {
        const faltasSnapshot = await getDocs(collection(db, "faltas"));
        const faltasData = faltasSnapshot.docs.map((doc) => doc.data().nombre);
        setFaltas(faltasData);

        const controlesSnapshot = await getDocs(collection(db, "controles"));
        const controlesData = controlesSnapshot.docs.map(
          (doc) => doc.data().nombre
        );
        setControles(controlesData);
      } catch (error) {
        console.error("Error al cargar faltas y controles: ", error);
      }
    };
    cargarDatosModal();
  }, []);

  const toggleCheck = (category, key) => {
    if (category === "informe") {
      setInformeChecks((prev) => ({ ...prev, [key]: !prev[key] }));
    } else {
      setControlChecks((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

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

  const buscarApellidoNombre = useCallback(async () => {
    if (!legajo) {
      setApellidoNombre("");
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
        setApellidoNombre("");
      }
    } catch (error) {
      console.error("Error al buscar empleado: ", error);
      alert("Ocurrió un error al buscar el empleado.");
    } finally {
      setLoading(false);
    }
  }, [legajo]);
  useEffect(() => {
    if (horaReal && horaTeorica) {
      const calcularDiferencia = (horaReal, horaTeorica) => {
        const [hReal, mReal] = horaReal.split(":").map(Number);
        const [hTeor, mTeor] = horaTeorica.split(":").map(Number);
        const minutosReal = hReal * 60 + mReal;
        const minutosTeorico = hTeor * 60 + mTeor;
        const diferencia = minutosTeorico - minutosReal;

        return diferencia;
      };

      const diferencia = calcularDiferencia(horaReal, horaTeorica);

      if (diferencia > 0) {
        setDetalleFalta(`Circula con ${diferencia} minutos de adelanto.`);
      } else if (diferencia < 0) {
        setDetalleFalta(
          `Circula con ${Math.abs(diferencia)} minutos de atraso.`
        );
      } else {
        setDetalleFalta("Circula en horario.");
      }
    }
  }, [horaReal, horaTeorica]);

  useEffect(() => {
    if (legajo) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        buscarApellidoNombre();
      }, 5000);
    } else {
      setApellidoNombre("");
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [legajo, buscarApellidoNombre]);

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
      !informeChecks ||
      !controlChecks ||
      !matafuego ||
      !celular ||
      !cinturon
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (
      !inspector ||
      !inspector.legajo ||
      !inspector.nombre ||
      !inspector.apellido
    ) {
      alert("Error: No se ha cargado un inspector válido.");
      console.log("Inspector data:", inspector);
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
        observaciones,
        auricular,
        matafuego,
        celular,
        informeChecks,
        controlChecks,
        cinturon,
        inspector: {
          numero: inspector.legajo,
          nombre: inspector.nombre,
          apellido: inspector.apellido,
        },

        inspectorNumero: inspector.legajo, // ✅ Nuevo campo fuera del objeto inspector
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
      setObservaciones("");
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

        <label>Inspector:</label>
        <input
          type="text"
          value={
            inspector
              ? `${inspector.legajo}${inspector.nombre} ${inspector.apellido}`
              : ""
          }
          readOnly
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
        <textarea value={detalleFalta} readOnly rows="4"></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="observaciones" className="form-label">
          Observaciones
        </label>
        <input
          id="observaciones"
          type="text"
          className="form-input"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>

      <div className="container">
        <button onClick={() => setModalInforme(true)}>Informe</button>
        <button onClick={() => setModalControl(true)}>Control</button>

        {modalInforme && (
          <>
            <div
              className="modal-overlay"
              onClick={() => setModalInforme(false)}
            ></div>
            <div className="modal">
              <h3>Informe</h3>
              {faltas.map((falta, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={!!informeChecks[falta]}
                    onChange={() => toggleCheck("informe", falta)}
                  />
                  {falta}
                </label>
              ))}
              <button onClick={() => setModalInforme(false)}>Cerrar</button>
            </div>
          </>
        )}

        {modalControl && (
          <>
            <div
              className="modal-overlay"
              onClick={() => setModalControl(false)}
            ></div>
            <div className="modal">
              <h3>Control</h3>
              {controles.map((control, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={!!controlChecks[control]}
                    onChange={() => toggleCheck("control", control)}
                  />
                  {control}
                </label>
              ))}
              <button onClick={() => setModalControl(false)}>Cerrar</button>
            </div>
          </>
        )}
      </div>

      <button onClick={guardarInforme} disabled={loading}>
        {loading ? "Guardando..." : "Guardar Informe"}
      </button>
    </div>
  );
};

export default Informe;
