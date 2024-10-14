import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            //path: '/', Limita el uso de la cookie a una ruta
        });

        return token;
    } catch (err) {
        throw new Error("Error generating token");
    }
};