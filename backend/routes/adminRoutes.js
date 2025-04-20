const express = require('express');
const { protect, adminProtect } = require('../config/auth');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();


// جلب جميع المستخدمين (للمسؤول فقط)
router.get('/users', protect, adminProtect, (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

//update user info base on id
router.put('/update', protect, adminProtect, (req, res) => {
  //const userId = req.params.id;
  const { email, fullName, userName, phone, password, id, role } = req.body;
  //console.log(email, fullName, userName, phone, password, id, role)

  User.updateUserWithRole(parseInt(id), email, fullName, userName, phone, password, role,(err) => {
    if (err) return res.status(500).json({ success : false, message: 'Server error: '+err });
    res.json({success:true, message: 'User updated' });
  });
});

//delete user base on id
router.delete('/user/:id', protect, (req, res) => {
  const userId = req.params.id;

  User.deleteUser(userId, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'User deleted successfully' });
  });
});

// تحديث المستخدم ليكون مسؤولًا (admin)
router.get('/user/admin/:id', protect, adminProtect, (req, res) => {
  const userId = req.params.id; 

  // تأكد أن هذا المستخدم يمكنه أن يصبح مسؤولًا
  User.updateUserToAdmin(userId, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'User status updated to Admin :'+userId });
  });
});


module.exports = router;
