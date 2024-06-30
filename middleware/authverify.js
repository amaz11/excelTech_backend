const jwt = require('jsonwebtoken');

const authVerify = (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', ok: false });
    }
};

module.exports = authVerify;