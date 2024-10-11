import { User } from "../db/models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {

    const {email, password, name} = req.body;
    try {

        if(!email || !password || !name) {
            throw new Error("Todos los campos son requeridos");
        }

        const userAlreadyExists = await User.findOne({ email});
        if(userAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "El usuario ya existe"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            name
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
    res.send("Signup route");
};

export const login = async (req, res) => {
    res.send("Login route");
};

export const logout = async (req, res) => {
    res.send("Logout route");
};