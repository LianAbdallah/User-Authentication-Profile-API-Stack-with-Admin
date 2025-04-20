const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
//const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');  
//const connect = require('connect');

dotenv.config();

const app = express();

// استخدام CORS و JSON في الطلبات
app.use(cors());
app.use(express.json());  // لتفسير بيانات JSON
//app.use(connect.bodyParser());

// إعداد المسارات
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
