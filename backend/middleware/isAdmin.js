const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_super_secret_jwt_key"; // Should be the same as in the controller

const isAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(403).send({ msg: "A token is required for authentication", status: 0 });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(401).send({ msg: "Access denied. Not an admin.", status: 0 });
        }
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({ msg: "Invalid Token", status: 0 });
    }
    
    return next();
};

module.exports = isAdmin;