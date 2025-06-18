const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const generateToken = require('../utils/generateToken');

const registerUser = async (userData, roleId, profileData, profileTable, res) => {
    const { email, password, fullName } = userData;

    if (!email || !password || !fullName) {
        res.status(400);
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc.');
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [users] = await connection.query('SELECT UserId FROM Users WHERE Email = ?', [email]);
        if (users.length > 0) {
            res.status(400);
            throw new Error('Email này đã được sử dụng.');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [userResult] = await connection.query(
            'INSERT INTO Users (Email, PasswordHash, FullName, RoleId) VALUES (?, ?, ?, ?)',
            [email, passwordHash, fullName, roleId]
        );
        const newUserId = userResult.insertId;

        const profileFields = Object.keys(profileData);
        const profileValues = Object.values(profileData);
        await connection.query(
            `INSERT INTO ${profileTable} (UserId, ${profileFields.join(', ')}) VALUES (?, ${'?'.repeat(profileFields.length).split('').join(', ')})`,
            [newUserId, ...profileValues]
        );

        await connection.commit();

        res.status(201).json({
            message: 'Đăng ký thành công!',
            userId: newUserId,
            email: email,
            fullName: fullName,
        });
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// @desc    Đăng ký tài khoản Sinh viên
// @route   POST /api/auth/register/student
// @access  Public
exports.registerStudent = asyncHandler(async (req, res) => {
    const { schoolName, major, academicYear } = req.body;
    const profileData = { schoolName, major, academicYear };
    await registerUser(req.body, 1, profileData, 'StudentProfiles', res); // RoleId 1 = Student
});

// @desc    Đăng ký tài khoản Nhà tuyển dụng
// @route   POST /api/auth/register/employer
// @access  Public
exports.registerEmployer = asyncHandler(async (req, res) => {
    const { companyName, address, website } = req.body;
    if (!companyName || !address) {
        res.status(400);
        throw new Error('Tên công ty và địa chỉ là bắt buộc.');
    }
    const profileData = { companyName, address, website };
    await registerUser(req.body, 2, profileData, 'EmployerProfiles', res); // RoleId 2 = Employer
});


// @desc    Đăng nhập người dùng & nhận token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT u.*, r.RoleName FROM Users u JOIN Roles r ON u.RoleId = r.RoleId WHERE u.Email = ?', [email]);

    if (users.length > 0) {
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        
        if (isMatch) {
            res.json({
                userId: user.UserId,
                email: user.Email,
                fullName: user.FullName,
                role: user.RoleName,
                token: generateToken(user.UserId, user.RoleName),
            });
        } else {
            res.status(401);
            throw new Error('Email hoặc mật khẩu không đúng.');
        }
    } else {
        res.status(401);
        throw new Error('Email hoặc mật khẩu không đúng.');
    }
});
exports.registerStudent = asyncHandler(async (req, res) => { /*...*/ });
exports.registerEmployer = asyncHandler(async (req, res) => { /*...*/ });
exports.loginUser = asyncHandler(async (req, res) => { /*...*/ });

// @desc    Lấy thông tin profile người dùng hiện tại
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.UserId;
    let profileData = {};

    if (req.user.RoleName === 'Student') {
        const [profile] = await db.query('SELECT * FROM StudentProfiles WHERE UserId = ?', [userId]);
        profileData = profile.length > 0 ? profile[0] : null;
    } else if (req.user.RoleName === 'Employer') {
        const [profile] = await db.query('SELECT * FROM EmployerProfiles WHERE UserId = ?', [userId]);
        profileData = profile.length > 0 ? profile[0] : null;
    }
    
    res.json({
        ...req.user,
        profile: profileData
    });
});
