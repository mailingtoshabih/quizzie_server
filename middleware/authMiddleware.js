// authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    // console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token verification failed' });
        }

        req.user = decoded; // Attach user information to the request
        next();
    });
};

module.exports = authMiddleware;
