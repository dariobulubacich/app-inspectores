import { useState } from "react";
import { auth, db } from "../../../firebase"; // Importa tu configuración de Firebase
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Inicio de sesión
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/cargajugadores");
        }
      } else {
        throw new Error("El usuario no tiene datos asociados en Firestore");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes ingresar una nueva contraseña.",
      });
      return;
    }

    try {
      const user = auth.currentUser;

      if (user) {
        await updatePassword(user, newPassword);
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Contraseña actualizada correctamente.",
        });
        setNewPassword("");
        setShowChangePassword(false);
      } else {
        throw new Error("No se pudo autenticar al usuario.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cambiar contraseña",
        text: error.message,
      });
    }
  };

  return (
    <Grid container={true}>
      <Grid style={{ padding: "12rem" }} size={{ xs: 12 }}>
        <div className="auth-container">
          <Typography
            variant="h1"
            style={{ color: "Black", fontSize: "8.5rem", width: "100%" }}
          >
            App Inspectores
          </Typography>
          <Typography
            variant="h3"
            style={{ width: "100%", color: "Black", fontSize: "3.5rem" }}
          >
            Inicio de Sesión
          </Typography>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                style={{ padding: "0.5rem", fontSize: "2rem", width: "100%" }}
                className="input-aut"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="password-container">
              <input
                style={{ padding: "0.5rem", fontSize: "2rem", width: "100%" }}
                className="input-aut"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ padding: "1rem" }}>
              <button
                style={{
                  padding: "1rem",
                  fontSize: "2.5rem",
                  width: "100%",
                  background: "blue",
                }}
                type="submit"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <p style={{ color: "white", fontSize: "2rem" }}>
            ¿Olvidaste tu contraseña?{" "}
            <button
              style={{ color: "white", fontSize: "2rem" }}
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              Cambiar contraseña
            </button>
          </p>

          {showChangePassword && (
            <form onSubmit={handleChangePassword}>
              <div className="password-container">
                <input
                  style={{
                    padding: "0.5rem",
                    fontSize: "2rem",
                    width: "100%",
                  }}
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ padding: "1rem" }}>
                <button
                  style={{
                    padding: "1rem",
                    fontSize: "2.5rem",
                    width: "100%",
                    background: "green",
                  }}
                  type="submit"
                >
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
