const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt .verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = authMiddleware;
