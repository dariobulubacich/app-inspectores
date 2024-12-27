import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoutes = () => {
  const { user } = useContext(AuthContext);

  if (user.rol !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
