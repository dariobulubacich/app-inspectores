import { createContext, useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Asegúrate de que la ruta sea correcta

// Crear el contexto
export const InspectorContext = createContext(null);

// Proveedor del contexto
export const InspectorProvider = ({ children }) => {
  const [inspector, setInspector] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarInspector = async () => {
      try {
        setLoading(true);

        // Aquí defines cómo identificar al inspector (ejemplo con un usuario específico)
        const inspectorQuery = query(
          collection(db, "inspectores"),
          where("legajo", "==", "123") // 🔹 Aquí debes definir cómo identificar al inspector actual
        );

        const querySnapshot = await getDocs(inspectorQuery);

        if (!querySnapshot.empty) {
          const inspectorData = querySnapshot.docs[0].data();
          setInspector(inspectorData);
        } else {
          console.error("No se encontró el inspector en Firebase.");
          setInspector(null);
        }
      } catch (error) {
        console.error("Error al cargar el inspector:", error);
        setInspector(null);
      } finally {
        setLoading(false);
      }
    };

    cargarInspector();
  }, []);

  return (
    <InspectorContext.Provider value={{ inspector, setInspector, loading }}>
      {children}
    </InspectorContext.Provider>
  );
};
