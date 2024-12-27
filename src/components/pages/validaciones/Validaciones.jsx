import { useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importar autenticación
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";

function CargaJugadores() {
  const [carnet, setCarnet] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [club, setClub] = useState("");
  const [categoria, setCategoria] = useState("");
  const [numeroCamiseta, setNumeroCamiseta] = useState("");
  const [numeroFecha, setNumeroFecha] = useState("");
  const [jugadorEncontrado, setJugadorEncontrado] = useState(null);

  const auth = getAuth(); // Obtener instancia de autenticación

  const buscarJugador = async () => {
    try {
      const jugadoresRef = collection(db, "jugadores");
      const q = query(jugadoresRef, where("carnet", "==", carnet));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const jugador = querySnapshot.docs[0];
        const data = jugador.data();

        setJugadorEncontrado({ id: jugador.id, ...data });
        setNombre(data.nombre);
        setApellido(data.apellido);
        setClub(data.club);
        setCategoria(data.categoria);
      } else {
        Swal.fire({
          title: "Jugador no encontrado",
          text: "Por favor verifica el Nº de carnet ingresado.",
          icon: "error",
        });
        setJugadorEncontrado(null);
      }
    } catch (error) {
      console.error("Error al buscar el jugador: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo buscar el jugador.",
        icon: "error",
      });
    }
  };

  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!jugadorEncontrado) {
      Swal.fire({
        title: "Error",
        text: "Busca un jugador antes de guardar los datos.",
        icon: "error",
      });
      return;
    }

    try {
      const usuarioActual = auth.currentUser
        ? auth.currentUser.email
        : "Anónimo";
      const fechaGuardado = new Date();

      await addDoc(collection(db, "fechasGuardadas"), {
        carnet,
        nombre,
        apellido,
        club,
        categoria,
        numeroCamiseta,
        numeroFecha,
        usuario: usuarioActual,
        fechaGuardado: fechaGuardado.toISOString(),
      });

      Swal.fire({
        title: "Datos guardados correctamente",
        text: `Jugador: ${nombre} ${apellido}, Fecha: ${numeroFecha}`,
        icon: "success",
      });

      // Limpiar formulario
      setCarnet("");
      setNombre("");
      setApellido("");
      setClub("");
      setCategoria("");
      setNumeroCamiseta("");
      setNumeroFecha("");
      setJugadorEncontrado(null);
    } catch (error) {
      console.error("Error al guardar los datos: ", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron guardar los datos.",
        icon: "error",
      });
    }
  };

  return (
    <Grid container={true}>
      <Grid size={{ xs: 12 }} textAlign={"center"}>
        <form onSubmit={guardarDatos}>
          <div>
            <Grid container={true}>
              <Grid
                size={{ xs: 12 }}
                textAlign={"center"}
                fontSize={"3rem"}
                color={"white"}
              >
                <div>
                  <h3 style={{ fontSize: "6.5rem" }}>Carga de Jugadores</h3>
                </div>
              </Grid>
            </Grid>
            <Grid container={true}>
              <Grid size={{ xs: 12 }} textAlign={"center"} padding={"1.5rem"}>
                <Typography
                  variant="h5"
                  style={{ width: "100%", color: "white", fontSize: "2.5rem" }}
                >
                  <p>Nº de Fecha a jugar</p>
                </Typography>
                <input
                  style={{
                    padding: "1.5rem",
                    fontSize: "1.5rem",
                    width: "10%",
                    textAlign: "center",
                  }}
                  className="inputs"
                  type="number"
                  placeholder="Nº Fecha"
                  value={numeroFecha}
                  onChange={(e) => setNumeroFecha(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <div>
              <Typography
                variant="h6"
                style={{ width: "100%", color: "white", fontSize: "2.5rem" }}
              >
                <p>Nº de carnet</p>
              </Typography>
              <input
                style={{
                  padding: "2rem",
                  fontSize: "2.5rem",
                  width: "15%",
                  textAlign: "center",
                }}
                className="inputs"
                type="text"
                placeholder=""
                value={carnet}
                onChange={(e) => setCarnet(e.target.value)}
                required
              />
            </div>
            <Grid container={true}>
              <Grid size={{ xs: 12 }} textAlign={"center"} padding={"1.5rem"}>
                <div>
                  <button
                    style={{
                      padding: "0.5rem",
                      color: "white",
                      textDecoration: "white",
                      background: "black",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "3rem",
                    }}
                    type="button"
                    className="buscar-button"
                    onClick={buscarJugador}
                  >
                    Buscar Jugador
                  </button>
                </div>
              </Grid>
            </Grid>
            {jugadorEncontrado && (
              <>
                <Grid container={true}>
                  <Grid
                    size={{ xs: 12 }}
                    textAlign={"center"}
                    padding={"1.5rem"}
                  >
                    <input
                      style={{
                        width: "70%",
                        textAlign: "center",
                        color: "white",
                        fontSize: "3rem",
                        background: "none",
                      }}
                      className="inputs"
                      type="text"
                      placeholder="Nombre"
                      value={nombre}
                      disabled
                    />
                    <input
                      style={{
                        width: "70%",
                        textAlign: "center",
                        color: "white",
                        fontSize: "3rem",
                        background: "none",
                      }}
                      className="inputs"
                      type="text"
                      placeholder="Apellido"
                      value={apellido}
                      disabled
                    />
                    <input
                      style={{
                        width: "70%",
                        textAlign: "center",
                        color: "white",
                        fontSize: "3rem",
                        background: "none",
                      }}
                      className="inputs"
                      type="text"
                      placeholder="Club"
                      value={club}
                      disabled
                    />
                    <div>
                      <input
                        style={{
                          width: "70%",
                          textAlign: "center",
                          color: "white",
                          fontSize: "3rem",
                          background: "none",
                        }}
                        className="inputs"
                        type="text"
                        placeholder="Categoría"
                        value={categoria}
                        disabled
                      />
                    </div>
                    <Grid container={true}>
                      <Grid
                        size={{ xs: 12 }}
                        textAlign={"center"}
                        padding={"1.5rem"}
                      >
                        <input
                          style={{
                            width: "25%",
                            textAlign: "center",
                            color: "black",
                            textDecoration: "white",
                            background: "white",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "2.5rem",
                            padding: "1rem",
                          }}
                          className="inputs"
                          type="number"
                          placeholder="Nº camiseta"
                          value={numeroCamiseta}
                          onChange={(e) => setNumeroCamiseta(e.target.value)}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </div>
          <button
            style={{
              padding: "0.5rem",
              color: "black",
              background: "green",
              border: "none",
              cursor: "pointer",
              fontSize: "3rem",
            }}
            type="submit"
            className="agregar-button"
          >
            Guardar
          </button>
        </form>
      </Grid>
    </Grid>
  );
}

export default CargaJugadores;
