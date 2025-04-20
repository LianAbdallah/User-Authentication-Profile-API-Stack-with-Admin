const express = require('express');
const User = require('../models/User');
const protect = require('../config/auth').protect;
const router = express.Router();

// الحصول على بيانات الملف الشخصي
router.get('/profile', protect, (req, res) => {
    const userId = req.user.userId;
    console.log(req.user)

    User.getUserById(userId, (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        res.json({
            email: user.email,
            fullName: user.fullName,
            userName: user.userName,
            phone: user.phone,
            createAt: user.createAt,
            lastLogin: user.lastLogin,
            role : user.role,
        });
    });
});

// تحديث بيانات الملف الشخصي
router.put('/profile', protect, (req, res) => {
    const { email, fullName, userName, phone, password } = req.body;
    const userId = req.user.userId;

    User.updateUser(userId, email, fullName, userName, phone, password, (err) => {
        if (err) return res.status(500).json({ success : false, message: 'Server error' +err});
        res.json({success: true, message: 'Profile updated' });
    });
});


//delete user
router.delete('/delete', protect, async (req, res) => {
    const userId = req.user.userId;  // get id from token
    console.log('User ID from token:', userId);
    
    User.deleteUser(userId, (err) => {//delete user from BD
        if (err) return res.status(500).json({ success : false,message: 'Error deleting user by this id: '+userId });
        console.log("user has been deleted", "userId: " ,userId); //log delete    
        res.json({success : true, message:"user has been deleted", "userId" :userId});   
      
    });

});

module.exports = router;
