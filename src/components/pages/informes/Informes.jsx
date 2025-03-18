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
  const [horaReal, setHoraReal] = useState("");
  const [horaTeorica, setHoraTeorica] = useState("");
  const [servicio, setServicio] = useState("");
  const [interno, setInterno] = useState("");
  const [interseccion, setInterseccion] = useState("");
  const [detalleFalta, setDetalleFalta] = useState("");
  const [lineas, setLineas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [auricular, setAuricular] = useState("");
  const [matafuego, setMatafuego] = useState("");
  const [celular, setCelular] = useState("");
  const [cinturon, setCinturon] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalControl, setModalControl] = useState(false);

  const [controles, setControles] = useState([]);
  const [informeChecks, setInformeChecks] = useState({});
  const [controlChecks, setControlChecks] = useState({});
  const [observaciones, setObservaciones] = useState("");
  const [turnoSeleccionado, setTurnoSeleccionado] = useState("");

  const [sectorSeleccionado, setSectorSeleccionado] = useState("");

  const { inspector } = useContext(InspectorContext); // Obtener información del inspector desde el contexto
  const timerRef = useRef(null); // useRef para almacenar el timer sin causar re-renders

  useEffect(() => {
    const cargarDatosModal = async () => {
      try {
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

        const turnosSnapshot = await getDocs(collection(db, "turnos"));
        const turnosData = turnosSnapshot.docs.map((doc) => doc.data().nombre);
        setTurnos(turnosData);
      } catch (error) {
        console.error("Error al cargar líneas y sectores: ", error);
        alert("Error al cargar líneas y sectores.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    const cargarSectores = async () => {
      if (!linea) return setSectores([]);

      try {
        console.log("Buscando sectores para línea:", linea);
        const q = query(collection(db, "lineas"), where("nombre", "==", linea));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          console.log("Datos obtenidos:", data);

          // Si sectores es un string, lo convertimos en array separándolo por comas
          const sectoresArray =
            typeof data.sectores === "string"
              ? data.sectores.split(",").map((s) => s.trim()) // Dividimos por coma y eliminamos espacios
              : data.sectores || [];

          setSectores(sectoresArray);
        } else {
          console.log("No se encontraron sectores.");
          setSectores([]);
        }
      } catch (error) {
        console.error("Error al cargar sectores:", error);
        alert("Ocurrió un error al cargar los sectores.");
      }
    };

    cargarSectores();
  }, [linea]);

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
      !sectores ||
      !turnos ||
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
        sectores,
        turnos,
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
      setTurnos("");
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
        <label className="label-informes">Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          disabled={loading}
        />
        <label className="label-informes">Inspector:</label>
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
        <label className="label-informes">Legajo:</label>
        <input
          className="imput-var"
          type="text"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
          disabled={loading}
        />
      </div>
      {apellidoNombre && (
        <div className="form-group">
          <label className="label-informes">Apellido y Nombre:</label>
          <input type="text" value={apellidoNombre} readOnly />
        </div>
      )}

      <div className="form-group">
        <label className="label-informes">Línea:</label>
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

        <label className="label-informes">Sectores:</label>
        <select
          className="select-informe"
          value={sectorSeleccionado}
          onChange={(e) => setSectorSeleccionado(e.target.value)}
          disabled={loading || sectores.length === 0}
        >
          <option value="">Sector</option>
          {Array.isArray(sectores) && sectores.length > 0 ? (
            sectores.map((sector, index) => (
              <option key={index} value={sector}>
                {sector}
              </option>
            ))
          ) : (
            <option disabled>No hay sectores disponibles</option>
          )}
        </select>
      </div>
      <div className="form-group">
        <label className="label-informes">Turno:</label>
        <select
          value={turnoSeleccionado}
          onChange={(e) => setTurnoSeleccionado(e.target.value)}
          disabled={loading}
        >
          <option value="">Turno</option>
          {turnos.map((turno, index) => (
            <option key={index} value={turno}>
              {turno}
            </option>
          ))}
        </select>

        <label className="label-informes">Servicio:</label>
        <input
          className="imput-var"
          type="text"
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          disabled={loading}
        />

        <label className="label-informes">Interno:</label>
        <input
          className="imput-var"
          type="text"
          value={interno}
          onChange={(e) => setInterno(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="label-informes-int">Intersección Alternativa:</label>
        <input
          type="text"
          value={interseccion}
          onChange={(e) => setInterseccion(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="label-informes">Hora Real de Paso:</label>
        <input
          type="time"
          value={horaReal}
          onChange={(e) => setHoraReal(e.target.value)}
          disabled={loading}
        />

        <label className="label-informes">Hora Teórica de Paso:</label>
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
          readOnly
          className="textarea-aut"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="observaciones" className="label-informes">
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
        <button onClick={() => setModalControl(true)}>Control</button>
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
      <div className="guardar-informe">
        <button
          onClick={guardarInforme}
          disabled={loading}
          className="guardar-informe"
        >
          {loading ? "Guardando..." : "Guardar Informe"}
        </button>
      </div>
    </div>
  );
};

export default Informe;
