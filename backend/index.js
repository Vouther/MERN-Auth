import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json()); //permite analizar la solicitud entrante: req.body
app.use(cookieParser()); //Permite analizar las cookies entrantes

// Conectamos la base de datos antes de iniciar el servidor
connectDB();

app.get("/", (req, res) => {
    res.send("Hola mundo!");
});

app.use("/api/auth", authRoutes)

// Iniciamos el servidor en el puerto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});