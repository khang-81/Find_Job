const express = require('express');
const router = express.Router();
const {
    updateStudentProfile,
    updateEmployerProfile,
    getUsers,
    updateUserStatus,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.put('/profile/student', protect, authorize('Student'), updateStudentProfile);
router.put('/profile/employer', protect, authorize('Employer'), updateEmployerProfile);

// Admin routes
router.get('/', protect, authorize('Admin'), getUsers);
router.put('/:id/status', protect, authorize('Admin'), updateUserStatus);

module.exports = router;