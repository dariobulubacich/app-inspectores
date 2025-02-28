import { useState, useEffect, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { InspectorContext } from "../../pages/contexts/InspectorContext";
import "./informesinspector.css";

const InformesInspector = () => {
  const { inspector, loading: inspectorLoading } = useContext(InspectorContext);
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerInformes = async () => {
      if (!inspector || !inspector.legajo) {
        console.warn("No se ha cargado un inspector válido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Consultar los informes filtrando por el número del inspector
        const informesQuery = query(
          collection(db, "informes"),
          where("inspectorNumero", "==", inspector.legajo) // Ahora sí funcionará
        );

        const querySnapshot = await getDocs(informesQuery);

        // Convertir los datos a un array de objetos
        const informesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInformes(informesData);
      } catch (error) {
        console.error("Error al obtener informes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!inspectorLoading) {
      obtenerInformes();
    }
  }, [inspector, inspectorLoading]);

  if (inspectorLoading) {
    return <p>Cargando inspector...</p>;
  }

  if (!inspector) {
    return <p>Error: No se ha encontrado un inspector válido.</p>;
  }

  return (
    <div className="container">
      <h1 className="title">
        Informes del Inspector {inspector.nombre} {inspector.apellido}
      </h1>

      {loading ? (
        <p>Cargando informes...</p>
      ) : informes.length === 0 ? (
        <p>No hay informes registrados.</p>
      ) : (
        <table className="informes-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Legajo</th>
              <th>Chofer</th>
              <th>Línea</th>
              <th>Sector</th>
              <th>Servicio</th>
              <th>Interno</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((informe) => (
              <tr key={informe.id}>
                <td>{informe.fecha}</td>
                <td>{informe.legajo}</td>
                <td>{informe.apellidoNombre}</td>
                <td>{informe.linea}</td>
                <td>{informe.sector}</td>
                <td>{informe.servicio}</td>
                <td>{informe.interno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InformesInspector;
