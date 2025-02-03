import Grid from "@mui/material/Grid2";
import "./Sabanas.css"; // Si quieres añadir estilos personalizados
import { useNavigate } from "react-router-dom";

function Sabanas() {
  const navigate = useNavigate();
  const enlaces = [
    {
      nombre: "Laboral",
      url: "https://docs.google.com/spreadsheets/d/1atQiOFh2GfAWQqdQyn-JuuKA5SUa73lY4GsW4zk9v28/edit?gid=2111607729#gid=2111607729",
    },
    {
      nombre: "M.Festivo",
      url: "https://docs.google.com/spreadsheets/d/13kiv6MmsIJYemhzj98Wz1fskrCTewrhg7T5omKxKT5g/edit?gid=844240084#gid=844240084",
    },
    {
      nombre: "Festivo",
      url: "https://docs.google.com/spreadsheets/d/1u5vuRj4hJaMtRFHlg68J0TB1cgilU9LSBZyHjha_yHQ/edit?gid=844240084#gid=844240084",
    },
  ];
  // Función para navegar al AdminDashboard
  const goToAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  return (
    <Grid container={true}>
      <Grid style={{ padding: "12rem" }} size={{ xs: 12 }}>
        <div className="sabanas-container">
          <h1>Sábanas</h1>
          <p>Selecciona uno de los siguientes enlaces:</p>
          <div className="botones-container">
            {enlaces.map((enlace, index) => (
              <button
                key={index}
                className="boton-enlace"
                onClick={() => window.open(enlace.url, "_blank")}
              >
                {enlace.nombre}
              </button>
            ))}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button className="volver-button" onClick={goToAdminDashboard}>
                Volver al Panel de Admini
              </button>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default Sabanas;
