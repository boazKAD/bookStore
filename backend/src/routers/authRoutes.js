import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
}

router.post('/register', async (req, res) => {
    try {
        // Handle user registration
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        if (username.length < 3) {
            return res.status(400).json({message: "Username must be at least 3 characters long"});
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({message: "Username already exists"});
        }
        // get rondom profile image
        const profileImage = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;
        const newUser = new User({
            username,
            email,
            password,
            profileImage,
        });
        await newUser.save();
        const token = generateToken(newUser._id);

        res.status(201).json({
            token, user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage,
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/login', async (req, res) => {
    // Handle user login
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("All fields are required");
        }
        // check user existence
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const token = generateToken(user._id);
        res.status(200).json({
            token, user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({message: "Internal Server Error"});

    }
    res.send('User logged in');
});

export default router;
