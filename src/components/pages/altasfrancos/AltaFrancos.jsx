import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const AltaFrancos = () => {
  const [legajo, setLegajo] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Guardar un franco manualmente en Firebase
  const formatFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const guardarFranco = async () => {
    if (!legajo || !fecha) {
      alert("Debe completar el legajo y la fecha.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "francos"), {
        legajo,
        fecha: formatFecha(fecha),
        motivo: motivo || "No especificado",
      });
      alert("Franco guardado exitosamente.");
      setLegajo("");
      setFecha("");
      setMotivo("");
    } catch (error) {
      console.error("Error al guardar franco:", error);
      alert("Error al guardar franco.");
    } finally {
      setLoading(false);
    }
  };

  // Importar francos desde un archivo Excel
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        for (let row of jsonData) {
          if (row.Legajo && row.Fecha) {
            let fechaOriginal = new Date((row.Fecha - 25569) * 86400 * 1000); // Convertir fecha Excel
            let fechaFormateada = fechaOriginal
              .toLocaleDateString("es-ES")
              .split("/")
              .map((num) => num.padStart(2, "0"))
              .join("/");

            await addDoc(collection(db, "francos"), {
              legajo: row.Legajo.toString(),
              fecha: fechaFormateada,
              motivo: row.Motivo || "No especificado",
            });
          }
        }
        alert("Francos importados correctamente.");
      };
    } catch (error) {
      console.error("Error al importar francos:", error);
      alert("Error al importar francos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Alta de Francos</h1>

      {/* Formulario Manual */}
      <div>
        <h2>Registrar Franco Manualmente</h2>
        <input
          type="text"
          placeholder="Legajo"
          value={legajo}
          onChange={(e) => setLegajo(e.target.value)}
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <input
          type="text"
          placeholder="Motivo (Opcional)"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
        <button onClick={guardarFranco} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Franco"}
        </button>
      </div>

      {/* Importar desde Excel */}
      <div>
        <h2>Importar Francos desde Excel</h2>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>

      <button onClick={() => navigate("/admin-dashboard")}>
        Volver al Panel
      </button>
    </div>
  );
};

export default AltaFrancos;
