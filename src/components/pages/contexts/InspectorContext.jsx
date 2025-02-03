import { createContext, useState } from "react";

// Crear el contexto
export const InspectorContext = createContext();

// Proveedor del contexto
export const InspectorProvider = ({ children }) => {
  const [inspector, setInspector] = useState(null);

  return (
    <InspectorContext.Provider value={{ inspector, setInspector }}>
      {children}
    </InspectorContext.Provider>
  );
};
