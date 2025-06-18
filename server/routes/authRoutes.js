const express = require('express');
const router = express.Router();
const {
    registerStudent,
    registerEmployer,
    loginUser,
    getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register/student', registerStudent);
router.post('/register/employer', registerEmployer);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile); // Bảo vệ route này

module.exports = router;