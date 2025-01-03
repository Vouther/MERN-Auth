import express from "express";
import {signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth} from '../controllers/authController.js';
import { verify } from "crypto";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
//Registro de usuario
router.post('/signup', signup);
//Iniciar sesion
router.post('/login', login);
//Cerrar sesion
router.post('/logout', logout);
//Verificar correo a traves de correo
router.post("/verify-email", verifyEmail);
//Solicitar cambio de contraseña
router.post('/forgot-password', forgotPassword);
//Cambiar contraseña
router.post('/reset-password/:token', resetPassword);

router.get('/check-auth', verifyToken, checkAuth);

export default router;