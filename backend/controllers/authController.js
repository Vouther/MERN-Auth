import { User } from "../db/models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../db/utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js"

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
    res.send("Login route");
};

export const logout = async (req, res) => {
    res.send("Logout route");
};