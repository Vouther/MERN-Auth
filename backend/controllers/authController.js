import { User } from "../db/models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../db/utils/generateTokenAndSetCookie.js"
import { sendVerificationEmail } from "../mailtrap/emails.js"

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

export const login = async (req, res) => {
    res.send("Login route");
};

export const logout = async (req, res) => {
    res.send("Logout route");
};