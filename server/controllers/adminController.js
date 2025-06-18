const asyncHandler = require('express-async-handler');
const db = require('../config/db');

// @desc    Lấy danh sách tin đang chờ duyệt
// @route   GET /api/admin/jobs/pending
// @access  Private (Admin)
exports.getPendingJobs = asyncHandler(async (req, res) => {
    const [jobs] = await db.query("SELECT * FROM Jobs WHERE Status = 'PendingApproval' ORDER BY CreatedAt DESC");
    res.json(jobs);
});

// @desc    Duyệt hoặc từ chối một tin tuyển dụng
// @route   PUT /api/admin/jobs/:id/approve
// @access  Private (Admin)
exports.approveJob = asyncHandler(async (req, res) => {
    const { approve } = req.body; // true hoặc false
    const jobId = req.params.id;

    if (approve) {
        await db.query("UPDATE Jobs SET Status = 'Open', IsApproved = 1 WHERE JobId = ?", [jobId]);
        res.json({ message: "Tin đã được duyệt thành công." });
    } else {
        await db.query("UPDATE Jobs SET Status = 'Rejected', IsApproved = 0 WHERE JobId = ?", [jobId]);
        res.json({ message: "Tin đã bị từ chối." });
    }
});
