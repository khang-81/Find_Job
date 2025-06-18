const asyncHandler = require('express-async-handler');
const db = require('../config/db');

// @desc    Sinh viên cập nhật hồ sơ
// @route   PUT /api/users/profile/student
// @access  Private (Student)
exports.updateStudentProfile = asyncHandler(async (req, res) => {
    const userId = req.user.UserId;
    const { schoolName, major, academicYear, skillsDescription, experience, cvUrl } = req.body;

    const [result] = await db.query(
        `UPDATE StudentProfiles SET 
            SchoolName = ?, Major = ?, AcademicYear = ?, SkillsDescription = ?, Experience = ?, CvUrl = ?
         WHERE UserId = ?`,
        [schoolName, major, academicYear, skillsDescription, experience, cvUrl, userId]
    );

    if (result.affectedRows === 0) {
        res.status(404);
        throw new Error('Không tìm thấy hồ sơ sinh viên');
    }

    res.json({ message: 'Cập nhật hồ sơ thành công!' });
});

// @desc    Employer cập nhật hồ sơ
// @route   PUT /api/users/profile/employer
// @access  Private (Employer)
exports.updateEmployerProfile = asyncHandler(async (req, res) => {
    const userId = req.user.UserId;
    const { companyName, address, website, phoneNumber } = req.body;
    
    // Cập nhật cả bảng Users (PhoneNumber) và EmployerProfiles
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.query('UPDATE Users SET PhoneNumber = ? WHERE UserId = ?', [phoneNumber, userId]);
        await connection.query(
            'UPDATE EmployerProfiles SET CompanyName = ?, Address = ?, Website = ? WHERE UserId = ?',
            [companyName, address, website, userId]
        );
        
        await connection.commit();
        res.json({ message: 'Cập nhật hồ sơ công ty thành công!' });
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
});

// @desc    Admin lấy danh sách tất cả người dùng
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = asyncHandler(async (req, res) => {
    const [users] = await db.query(`
        SELECT u.UserId, u.Email, u.FullName, u.PhoneNumber, u.IsActive, u.CreatedAt, r.RoleName
        FROM Users u
        JOIN Roles r ON u.RoleId = r.RoleId
        ORDER BY u.CreatedAt DESC
    `);
    res.json(users);
});

// @desc    Admin kích hoạt/vô hiệu hóa tài khoản
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body; // true or false
    const userId = req.params.id;
    
    await db.query('UPDATE Users SET IsActive = ? WHERE UserId = ?', [isActive, userId]);

    res.json({ message: 'Cập nhật trạng thái người dùng thành công.' });
});