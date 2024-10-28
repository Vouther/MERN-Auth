import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Unauthorized - Token expired" });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
        } else {
            console.error("Error en verifyToken:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
};
