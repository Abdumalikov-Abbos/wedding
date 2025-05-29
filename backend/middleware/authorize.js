const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

// Middleware to check if user has proper role
const authorize = (roles = []) => {
    // roles param can be a single role string (e.g. 'admin') or an array of strings (e.g. ['admin', 'restaurant_owner'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        try {
            // Get token from header
            const token = req.header('x-auth-token');
            if (!token) {
                return res.status(401).json({ msg: 'No token, authorization denied' });
            }

            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                req.user = decoded.user;

                // Check if token exists in database
                const tokenDoc = await Token.findOne({ token });
                if (!tokenDoc) {
                    // Create new token document if it doesn't exist
                    await Token.create({
                        token,
                        user: decoded.user.id,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
                    });
                }

                // Check if token is blacklisted or expired
                if (tokenDoc && (tokenDoc.blacklisted || tokenDoc.isExpired())) {
                    return res.status(401).json({ msg: 'Token is invalid or expired' });
                }

                // Check if user has required role
                if (!roles.includes(decoded.user.role)) {
                    return res.status(403).json({ msg: 'User not authorized to perform this action' });
                }

                next();
            } catch (err) {
                res.status(401).json({ msg: 'Token is not valid' });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    };
};

// Export specific role checkers
const authorizeAdmin = authorize(['admin']);
const authorizeRestaurantOwner = authorize(['restaurant_owner']);
const authorizeUser = authorize(['user']);
const authorizeRestaurantOwnerOrAdmin = authorize(['restaurant_owner', 'admin']);

module.exports = {
    authorize,
    authorizeAdmin,
    authorizeRestaurantOwner,
    authorizeUser,
    authorizeRestaurantOwnerOrAdmin
};
