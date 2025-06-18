const express = require('express');
const router = express.Router();
const {
    getPendingJobs,
    approveJob,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route trong file này đều yêu cầu đăng nhập và có vai trò 'Admin'
router.use(protect, authorize('Admin'));

router.get('/jobs/pending', getPendingJobs);
router.put('/jobs/:id/approve', approveJob);

module.exports = router;
