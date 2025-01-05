import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

function ListarJugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [filteredJugadores, setFilteredJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("apellido");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  // Función para obtener jugadores desde Firestore
  const fetchJugadores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "fechasGuardadas"));
      const jugadoresList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJugadores(jugadoresList);
      setFilteredJugadores(jugadoresList);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener jugadores:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJugadores();
  }, []);

  // Filtrar jugadores cuando cambia el término de búsqueda, el criterio de filtro o las fechas
  useEffect(() => {
    const filterJugadores = () => {
      const term = searchTerm.toLowerCase();
      const filtered = jugadores.filter((jugador) => {
        // Filtrar por campo seleccionado
        let matchesFilter = true;
        if (filterBy === "apellido") {
          matchesFilter = jugador.apellido?.toLowerCase().includes(term);
        } else if (filterBy === "carnet") {
          matchesFilter = jugador.carnet?.toString().includes(term);
        } else if (filterBy === "club") {
          matchesFilter = jugador.club?.toLowerCase().includes(term);
        }

        // Filtrar por rango de fechas
        if (startDate && endDate && jugador.fechaGuardado) {
          const jugadorFecha = new Date(jugador.fechaGuardado);
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (jugadorFecha < start || jugadorFecha > end) {
            matchesFilter = false;
          }
        }

        return matchesFilter;
      });
      setFilteredJugadores(filtered);
    };

    filterJugadores();
  }, [searchTerm, filterBy, startDate, endDate, jugadores]);

  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredJugadores);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");
    XLSX.writeFile(workbook, "ListadoJugadores.xlsx");
  };

  // Función para imprimir
  const printTable = () => {
    const printContents = document.getElementById("jugadoresTable").outerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(
      "<html><head><title>Listado de Jugadores</title></head><body>"
    );
    printWindow.document.write(printContents);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <p>Cargando jugadores...</p>;
  }
  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="listar-jugadores">
      <h2>Listado de Jugadores</h2>
      {jugadores.length === 0 ? (
        <p>No hay jugadores registrados.</p>
      ) : (
        <>
          <div className="actions">
            <div>
              <select
                className="input"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="apellido">Apellido</option>
                <option value="carnet">Carnet</option>
                <option value="club">Club</option>
              </select>
              <input
                className="input"
                type="text"
                placeholder={`Buscar por ${filterBy}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="date-filters">
              <label>
                Desde:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                Hasta:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="button-exp-imp">
            <button className="button-export" onClick={exportToExcel}>
              Exportar a Excel
            </button>
            <button className="button-export" onClick={printTable}>
              Imprimir
            </button>

            <button className="volver-button" onClick={goToAdminDashboard}>
              Volver al Panel de Administrador
            </button>
          </div>
          <table id="jugadoresTable" className="jugadores-table">
            <thead>
              <tr>
                <th>Carnet</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Club</th>
                <th>Categoría</th>
                <th>Nº Camiseta</th>
                <th>Fecha Guardado</th>
              </tr>
            </thead>
            <tbody>
              {filteredJugadores.map((jugador) => (
                <tr key={jugador.id}>
                  <td>{jugador.carnet}</td>
                  <td>{jugador.nombre}</td>
                  <td>{jugador.apellido}</td>
                  <td>{jugador.club}</td>
                  <td>{jugador.categoria}</td>
                  <td>{jugador.numeroCamiseta}</td>
                  <td>
                    {jugador.fechaGuardado
                      ? new Date(jugador.fechaGuardado).toLocaleDateString()
                      : "No registrado"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ListarJugadores;
