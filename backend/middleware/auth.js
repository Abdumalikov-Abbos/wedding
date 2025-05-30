const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if not token or invalid format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Auth Error: No token or invalid format');
        return res.status(401).json({ message: 'Token topilmadi, ruxsat rad etildi' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user from token to request object
        // Ensure user object structure matches what is needed (e.g., id, role)
        // req.user = decoded.user;

        // Optional: Fetch user from DB to ensure user exists and is active (more secure)
        const user = await User.findById(decoded.user.id).select('-password');
        if (!user) {
            console.log('Auth Error: User not found in DB after token verification');
            return res.status(401).json({ message: 'Token yaroqsiz (User topilmadi)' });
        }

        // Attach full user object or necessary fields to request
        req.user = { id: user.id, role: user.role, username: user.username };

        next();
    } catch (err) {
        // Handle token verification errors
        console.error('Auth Error: Token verification failed:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Tokenning amal qilish muddati tugagan' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token yaroqsiz' });
        }
        // Other potential JWT errors
        res.status(401).json({ message: 'Token yaroqsiz, ruxsat rad etildi' });
    }
};
