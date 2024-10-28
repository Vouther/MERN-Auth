import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../db/models/User.js";
import { generateTokenAndSetCookie } from "../db/utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js"

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son requeridos"
        });
    }

    try {
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "El usuario ya existe"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generamos el token de verificación
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // Crearmos el nuevo usuario
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        sendVerificationEmail(user.email, verificationToken);

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente. Revisa tu correo para verificar tu cuenta.",
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error del servidor, inténtalo nuevamente",
            error: err.message
        });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: "El código de verificación es requerido" });
    }

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Código de verificación inválido o expirado" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        // Enviar correo de bienvenida en segundo plano
        sendWelcomeEmail(user.email, user.name);

        console.log(`Correo verificado exitosamente para el usuario con email: ${user.email}`);

        res.status(200).json({ success: true, message: "Correo verificado exitosamente"});

    } catch (err) {
        res.status(500).json({ success: false, message: "Error del servidor", error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validación de entrada
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Credenciales inválidas" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Credenciales inválidas" });
        }

        // Generar JWT y guardar en la cookie
        generateTokenAndSetCookie(res, user._id);

        // Registrar el último inicio de sesión
        user.lastLogin = Date.now();
        await user.save();

        // Respuesta exitosa
        res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso",
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (err) {
        console.error("Error al iniciar sesión", err.message);
        res.status(500).json({ success: false, message: "Error del servidor", error: err.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    res.status(200).json({ success: true, message: "Cierre de sesión exitoso" });
};

export const forgotPassword = async (req, res) => {
    const {email} = req.body;


    if (!email) {
        return res.status(400).json({ success: false, message: "Email es requerido" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ success: true, message: "Si la cuenta existe, se ha enviado un correo para restablecer la contraseña." });
        }

        //Generacion de token de reseteo
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // Enviar correo
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Si la cuenta existe, se ha enviado un correo para restablecer la contraseña." });
    }
    catch(err){
        console.error("Error en forgotPassword", err);
        res.status(400).json({success: false, message: err.message})
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 8 caracteres." });
        }

        const user = await User.findOne({
            resetPasswordExpiresAt: { $gt: Date.now() },
            email: req.body.email
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Token de reinicio no válido o vencido (1)" });
        }

        const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isTokenValid) {
            return res.status(400).json({ success: false, message: "Token de reinicio no válido o vencido (2)" });
        }

        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({ success: false, message: "La nueva contraseña no puede ser igual a la anterior." });
        }

        // Proceso de actualización de contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: "Restablecimiento de contraseña exitoso"});
    }catch(err){
        console.log("Error en resetPassword", err);
        res.status(500).json({ success: false, message: "Error del servidor, intenta nuevamente más tarde." });
    }
};

export const checkAuth = async (req, res) => {
    try {

        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error("Error in checkAuth:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};