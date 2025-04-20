const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const router = express.Router();
dotenv.config();

//router.use(express.json());

// تسجيل مستخدم جديد
router.post('/register', (req, res) => {
    const { email, fullName, userName, password, phone } = req.body;

    console.log("user with :", email, fullName, userName, phone," try register :)" )

    // تحقق من وجود المستخدم
    User.checkUserCredentials(email, (err, results) => {
        if (err) return res.status(500).json({success:false, message: 'Server error' });
        if (results.length > 0) return res.status(400).json({ success:false, message: 'User already exists' });

        // إنشاء المستخدم
        User.createUser(email, fullName, userName, password, phone, (err, result) => {
            if (err) return res.status(500).json({success:false, message: 'Error creating user' + err});
            console.log(`User created with email ${email}`)
            res.status(201).json({success:true,  message: 'User created' });
        });
    });
});

// تسجيل الدخول
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    //check user credentials
    User.checkUserCredentials(email, (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error comparing password' });
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

            // updatw lastLogin date
            User.updateLastLogin(user.id,(err) => {
                if (err) return res.status(500).json({ message: 'Error updating last login' });
            });

            // create JWT base with payload conatins id and role.
            const token = jwt.sign({ userId: user.id , role: user.role}, process.env.JWT_SECRET, { expiresIn: '30d' });
            console.log(`user with the email :${user.email} and the token: ${token} has been login now`)
            res.json({success:true, token });
        });
    });
});

module.exports = router;
