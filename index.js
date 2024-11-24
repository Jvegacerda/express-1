const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3001, () => console.log("¡Servidor encendido en el puerto 3001!"));

const repertorioPath = __dirname + "/repertorio.json";

// Rutas
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/canciones", (req, res) => {
    const data = fs.readFileSync(repertorioPath, "utf8");
    res.json(JSON.parse(data));
});

app.get("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const canciones = JSON.parse(fs.readFileSync(repertorioPath, "utf8"));
    const cancion = canciones.find(c => c.id == id);
    res.json(cancion || {});
});

app.post("/canciones", (req, res) => {
    const nuevaCancion = req.body;
    const canciones = JSON.parse(fs.readFileSync(repertorioPath, "utf8"));
    nuevaCancion.id = canciones.length ? canciones[canciones.length - 1].id + 1 : 1;
    canciones.push(nuevaCancion);
    fs.writeFileSync(repertorioPath, JSON.stringify(canciones, null, 2));
    res.status(201).send("Canción agregada con éxito.");
});

app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
    const canciones = JSON.parse(fs.readFileSync(repertorioPath, "utf8"));
    const index = canciones.findIndex(c => c.id == id);
    if (index !== -1) {
        canciones[index] = { ...canciones[index], ...datosActualizados };
        fs.writeFileSync(repertorioPath, JSON.stringify(canciones, null, 2));
    }
    res.send("Canción editada con éxito.");
});

app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    let canciones = JSON.parse(fs.readFileSync(repertorioPath, "utf8"));
    canciones = canciones.filter(c => c.id != id);
    fs.writeFileSync(repertorioPath, JSON.stringify(canciones, null, 2));
    res.send("Canción eliminada con éxito.");
});
