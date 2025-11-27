import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers("Authorization").replace("Bearer ", "");
        if (!token)
            return res.status(401).json({ message: "No authentication token, access denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user)
            return res.status(401).json({ message: "Token is not valid, access denied" });
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid, access denied" });
    }
};

export default protectRoute;