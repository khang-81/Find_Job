const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // [MỚI]
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');
const masterDataRoutes = require('./routes/masterDataRoutes'); // [MỚI]

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định tuyến API
app.get('/', (req, res) => {
    res.send('API for Hanoi Student Gigs is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // [MỚI]
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/master-data', masterDataRoutes); // [MỚI]


// Middleware xử lý lỗi
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Backend server đang chạy trên cổng ${PORT}`);
});
