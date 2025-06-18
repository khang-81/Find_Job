const asyncHandler = require('express-async-handler');
const db = require('../config/db');

// @desc    Tạo một tin tuyển dụng mới
// @route   POST /api/jobs
// @access  Private (Chỉ Employer)
exports.createJob = asyncHandler(async (req, res) => {
    const employerUserId = req.user.UserId;
    const {
        title, description, requirements, jobType, categoryId, locationId,
        addressDetail, isRemote, salaryDescription, contactInfo, applicationDeadline
    } = req.body;

    if (!title || !description || !jobType || !salaryDescription) {
        res.status(400);
        throw new Error("Vui lòng điền các trường bắt buộc: Tiêu đề, Mô tả, Loại hình, Lương.");
    }

    const [result] = await db.query(
        `INSERT INTO Jobs (EmployerUserId, Title, Description, Requirements, JobType, CategoryId, LocationId, AddressDetail, IsRemote, SalaryDescription, ContactInfo, ApplicationDeadline, Status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PendingApproval')`,
        [employerUserId, title, description, requirements, jobType, categoryId, locationId, addressDetail, isRemote, salaryDescription, contactInfo, applicationDeadline]
    );

    res.status(201).json({ message: 'Tạo tin thành công, đang chờ duyệt.', jobId: result.insertId });
});

// @desc    Lấy tất cả các tin tuyển dụng (đã được duyệt) có phân trang và lọc
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res) => {
    let query = `SELECT j.JobId, j.Title, j.JobType, j.SalaryDescription, j.CreatedAt,
                        c.Name AS CategoryName, l.Name AS LocationName, j.IsRemote,
                        ep.CompanyName
                 FROM Jobs j
                 LEFT JOIN JobCategories c ON j.CategoryId = c.CategoryId
                 LEFT JOIN Locations l ON j.LocationId = l.LocationId
                 LEFT JOIN EmployerProfiles ep ON j.EmployerUserId = ep.UserId
                 WHERE j.IsApproved = 1 AND j.Status = 'Open'`;

    const params = [];
    
    // Thêm logic lọc ở đây nếu cần (ví dụ: ?locationId=1&categoryId=2)
    //...

    query += " ORDER BY j.CreatedAt DESC";

    const [jobs] = await db.query(query, params);
    res.json(jobs);
});

// @desc    Lấy chi tiết một tin tuyển dụng
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = asyncHandler(async (req, res) => {
    const query = `
        SELECT j.*, c.Name AS CategoryName, l.Name AS LocationName,
               ep.CompanyName, ep.Address AS CompanyAddress, ep.Website
        FROM Jobs j
        LEFT JOIN JobCategories c ON j.CategoryId = c.CategoryId
        LEFT JOIN Locations l ON j.LocationId = l.LocationId
        LEFT JOIN EmployerProfiles ep ON j.EmployerUserId = ep.UserId
        WHERE j.JobId = ? AND j.IsApproved = 1 AND j.Status = 'Open'
    `;
    
    const [jobs] = await db.query(query, [req.params.id]);

    if (jobs.length > 0) {
        res.json(jobs[0]);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy tin tuyển dụng');
    }
});

// @desc    Sinh viên ứng tuyển vào một công việc
// @route   POST /api/jobs/:id/apply
// @access  Private (Chỉ Student)
exports.applyForJob = asyncHandler(async (req, res) => {
    const studentUserId = req.user.UserId;
    const jobId = req.params.id;
    const { coverLetter, cvUrlAtTimeOfApply } = req.body;

    // Kiểm tra xem đã ứng tuyển chưa
    const [existing] = await db.query('SELECT ApplicationId FROM JobApplications WHERE JobId = ? AND StudentUserId = ?', [jobId, studentUserId]);
    if (existing.length > 0) {
        res.status(400);
        throw new Error("Bạn đã ứng tuyển vào công việc này rồi.");
    }

    // Nếu chưa có CV lúc apply, lấy CV từ profile
    let cvUrl = cvUrlAtTimeOfApply;
    if (!cvUrl) {
        const [profile] = await db.query('SELECT CvUrl FROM StudentProfiles WHERE UserId = ?', [studentUserId]);
        if (profile.length > 0) {
            cvUrl = profile[0].CvUrl;
        }
    }

    if (!cvUrl) {
         res.status(400);
         throw new Error("Vui lòng tải lên CV trong hồ sơ hoặc đính kèm khi ứng tuyển.");
    }

    await db.query(
        'INSERT INTO JobApplications (JobId, StudentUserId, CoverLetter, CvUrlAtTimeOfApply) VALUES (?, ?, ?, ?)',
        [jobId, studentUserId, coverLetter, cvUrl]
    );

    res.status(201).json({ message: 'Ứng tuyển thành công!' });
});

// @desc    Employer cập nhật một tin tuyển dụng
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
exports.updateJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const employerUserId = req.user.UserId;

    // Kiểm tra xem tin đăng có tồn tại và có thuộc về employer này không
    const [jobs] = await db.query('SELECT EmployerUserId FROM Jobs WHERE JobId = ?', [jobId]);
    if (jobs.length === 0) {
        res.status(404);
        throw new Error('Không tìm thấy tin tuyển dụng.');
    }
    if (jobs[0].EmployerUserId !== employerUserId) {
        res.status(403);
        throw new Error('Bạn không có quyền chỉnh sửa tin này.');
    }

    // Cập nhật thông tin
    const { title, description, requirements, jobType, categoryId, locationId, addressDetail, isRemote, salaryDescription, contactInfo, applicationDeadline, status } = req.body;

    await db.query(
        `UPDATE Jobs SET Title = ?, Description = ?, Requirements = ?, JobType = ?, CategoryId = ?, LocationId = ?, AddressDetail = ?, IsRemote = ?, SalaryDescription = ?, ContactInfo = ?, ApplicationDeadline = ?, Status = ?
         WHERE JobId = ?`,
        [title, description, requirements, jobType, categoryId, locationId, addressDetail, isRemote, salaryDescription, contactInfo, applicationDeadline, status, jobId]
    );

    res.json({ message: 'Cập nhật tin tuyển dụng thành công.' });
});

// @desc    Employer xóa một tin tuyển dụng
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
exports.deleteJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const employerUserId = req.user.UserId;

    // Kiểm tra quyền sở hữu tương tự như update
    const [jobs] = await db.query('SELECT EmployerUserId FROM Jobs WHERE JobId = ?', [jobId]);
    if (jobs.length === 0) {
        res.status(404);
        throw new Error('Không tìm thấy tin tuyển dụng.');
    }
    if (jobs[0].EmployerUserId !== employerUserId) {
        res.status(403);
        throw new Error('Bạn không có quyền xóa tin này.');
    }

    await db.query('DELETE FROM Jobs WHERE JobId = ?', [jobId]);

    res.json({ message: 'Xóa tin tuyển dụng thành công.' });
});

// @desc    Employer xem các tin mình đã đăng
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer)
exports.getMyPostedJobs = asyncHandler(async (req, res) => {
    const employerUserId = req.user.UserId;
    const [jobs] = await db.query('SELECT * FROM Jobs WHERE EmployerUserId = ? ORDER BY CreatedAt DESC', [employerUserId]);
    res.json(jobs);
});

// @desc    Employer xem danh sách ứng viên cho một tin đăng
// @route   GET /api/jobs/:id/applicants
// @access  Private (Employer)
exports.getJobApplicants = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const employerUserId = req.user.UserId;

    // Kiểm tra quyền sở hữu
    const [jobs] = await db.query('SELECT EmployerUserId FROM Jobs WHERE JobId = ?', [jobId]);
    if (jobs.length === 0) {
        res.status(404);
        throw new Error('Không tìm thấy tin tuyển dụng.');
    }
    if (jobs[0].EmployerUserId !== employerUserId) {
        res.status(403);
        throw new Error('Bạn không có quyền xem danh sách này.');
    }

    const [applicants] = await db.query(`
        SELECT a.ApplicationId, a.ApplicationDate, a.Status, a.CoverLetter, a.CvUrlAtTimeOfApply,
               u.UserId AS StudentId, u.FullName, u.Email,
               sp.SchoolName, sp.Major
        FROM JobApplications a
        JOIN Users u ON a.StudentUserId = u.UserId
        JOIN StudentProfiles sp ON u.UserId = sp.UserId
        WHERE a.JobId = ?
        ORDER BY a.ApplicationDate DESC
    `, [jobId]);

    res.json(applicants);
});
