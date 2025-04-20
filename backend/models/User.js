const bcrypt = require('bcryptjs');
const db = require('../config/db.js');

// دالة لإنشاء مستخدم جديد
const createUser = (email, fullName, userName, password, phone, callback) => {
    const createAt = new Date();
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err);
        }
        const query = 'INSERT INTO users (email, fullName, userName, password, phone, createAt) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [email, fullName, userName, hashedPassword, phone, createAt], callback);
    });
};

// دالة للتحقق من بيانات الاعتماد
const checkUserCredentials = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], callback);
};

// دالة للحصول على بيانات المستخدم
const getUserById = (userId, callback) => {
    const query = 'SELECT email, fullName, userName, phone, createAt, lastLogin, role FROM users WHERE id = ?';
    db.query(query, [userId], callback);
};

// دالة لتحديث بيانات المستخدم
const updateUser = (userId, email, fullName, userName, phone, password, callback) => {
    const lastLogin = new Date();
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err);
        }
        const query = 'UPDATE users SET email = ?, fullName = ?, userName = ?, password = ?, phone = ?, lastLogin = ? WHERE id = ?';
        db.query(query, [email, fullName, userName, hashedPassword, phone, lastLogin, userId], callback);
    });
};

//update user from admin with role
const updateUserWithRole = (userId, email, fullName, userName, phone, password,role, callback) => {
    const lastLogin = new Date();
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err);
        }
        const query = 'UPDATE users SET email = ?, fullName = ?, userName = ?, password = ?, phone = ?, lastLogin = ? ,role = ? WHERE id = ?';
        db.query(query, [email, fullName, userName, hashedPassword, phone, lastLogin, role, userId], callback);
    });
};

// دالة لتحديث بيانات المستخدم
const updateLastLogin = (userId, callback) => {
    const lastLogin = new Date();    
    const query = 'UPDATE users SET lastLogin = ? WHERE id = ?';
    db.query(query, [lastLogin, userId], callback);
};

//delete one user by the email
const deleteUser = (id, callback)=>{
    const query = 'DELETE FROM users WHERE id = ? LIMIT 1';
    db.query(query, [id], callback);
}


// دالة لتحقق من أن المستخدم هو المسؤول (isAdmin)
const isAdmin = (userId, callback) => {
    const query = 'SELECT isAdmin FROM users WHERE id = ?';
    db.query(query, [userId], callback);
};

//*** */
// جلب جميع المستخدمين
const getAllUsers = (callback) => {
    const query = 'SELECT id, email, fullName, userName, phone, createAt, lastLogin, role FROM users';
    db.query(query, callback);
};

// دالة لتحديث حالة "الإدمن" (من يوزر إلى ادمن)
const updateUserToAdmin = (userId, callback) => {
    const query = "UPDATE users SET role = 'admin' WHERE id = ?";
    db.query(query, [userId], callback);
};

module.exports = {
    createUser,
    checkUserCredentials,
    getUserById,
    updateUser,
    updateLastLogin,
    isAdmin,
    getAllUsers,
    deleteUser,
    updateUserToAdmin,
    updateUserWithRole
};

