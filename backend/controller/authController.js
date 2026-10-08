
const User = require("../model/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generatetoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });

        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const message = `Welcome to Shopnest, ${name}! Your OTP is ${otp}`;
            await sendEmail(email, "Welcome to Shopnest - your OTP for registration", message);

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generatetoken(user._id),
            });
        }

        return res.status(400).json({ message: "Invalid user data" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generatetoken(user._id),
            });
        }

        return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
       res.json(users);
    } catch (error) {
        
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, getUsers };