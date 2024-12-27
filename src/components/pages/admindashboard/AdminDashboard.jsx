import { useNavigate } from "react-router-dom";
import "./admindashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Bienvenido al panel de administrador</h1>
      <div>
        <nav>
          <ul className="ul-nav">
            <li>
              <button onClick={() => navigate("/Informes")}>Informes</button>
            </li>
            <li>
              <button onClick={() => navigate("/Validaciones")}>
                Validaciones
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/Francos")}>Francos</button>
            </li>

            <li>
              <button onClick={() => navigate("/Listados")}>Listados</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
