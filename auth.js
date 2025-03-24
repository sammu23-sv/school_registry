require("dotenv").config();
const jwt = require("jsonwebtoken");

// 🔹 Middleware: Authenticate JWT Token
exports.authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {return res.status(401).json({ message: "Access Denied" });
    }
    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

// 🔹 Middleware: Restrict Access Based on Role
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Access Denied" });
        }
        next();
    };
};

