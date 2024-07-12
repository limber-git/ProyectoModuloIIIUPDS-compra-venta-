import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const navigate = useNavigate();

  if (!user || !allowedRoles.includes(user.cargo)) {
    toast.error("Acceso no autorizado a esta ruta.");
    // Opcional: Puedes redirigir a una página diferente si lo prefieres
    // navigate("/unauthorized"); // Asegúrate de tener una ruta definida para /unauthorized en tu Router
    return null; // O simplemente retornar null para evitar renderizar el children
  }

  return children;
};

export default PrivateRoute;
