import { useState } from "react";
import { auth, db } from "../../../firebaseConfig"; // Importa tu configuración de Firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidad
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        // Registro de usuario
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Guardar datos en Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user", // Rol predeterminado
        });

        Swal.fire(
          "Registro exitoso",
          "Usuario registrado exitosamente",
          "success"
        );
        navigate("/validaciones"); // Redirigir al usuario registrado
      } else {
        // Inicio de sesión
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Obtener rol desde Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          navigate(role === "admin" ? "/admin-dashboard" : "/Validaciones");
        } else {
          throw new Error("El usuario no tiene datos asociados en Firestore");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.message,
      });
    }
  };

  return (
    <Grid container>
      <Grid style={{ padding: "12rem" }} xs={12}>
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
            {isRegister ? "Registro" : "Inicio de Sesión"}
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Campo de Email */}
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

            {/* Campo de Contraseña con Mostrar/Ocultar */}
            <div className="password-container">
              <input
                style={{ padding: "0.5rem", fontSize: "2rem", width: "100%" }}
                className="input-aut"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar 🔒" : "Mostrar 👁"}
              </button>
            </div>

            {/* Botón de Enviar */}
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
                {isRegister ? "Registrar" : "Iniciar Sesión"}
              </button>
            </div>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Botón para cambiar entre Iniciar Sesión y Registrarse */}
          <p style={{ color: "Black", fontSize: "2rem" }}>
            {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
            <button
              style={{ color: "Black", fontSize: "3rem" }}
              className="toggle-button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
