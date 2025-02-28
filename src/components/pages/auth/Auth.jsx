import { useState } from "react";
import { auth, db } from "../../../firebaseConfig"; // Importa tu configuración de Firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    <div className="div-insp">
      <p style={{ fontSize: "2.5rem" }}>App Inspectores</p>
      {isRegister ? "Registro" : "Inicio de Sesión"}
      <form onSubmit={handleSubmit}>
        {/* Campo de Email */}
        <div className="parrafo-iniciosesion">
          <input
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
        <div>
          <button type="submit">
            {isRegister ? "Registrar" : "Iniciar Sesión"}
          </button>
        </div>
      </form>
      {error && <p>{error}</p>}
      {/* Botón para cambiar entre Iniciar Sesión y Registrarse */}
      <p>
        {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
        <button
          className="toggle-button"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </button>
      </p>
    </div>
  );
};

export default Login;
