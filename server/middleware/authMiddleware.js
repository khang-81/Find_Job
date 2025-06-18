const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require('../config/db');

// Middleware: Kiểm tra xem người dùng đã đăng nhập chưa (dựa vào token)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header
            token = req.headers.authorization.split(' ')[1];

            // Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin người dùng từ DB (không lấy mật khẩu) và gắn vào request
            const [rows] = await db.query('SELECT u.UserId, u.Email, r.RoleName FROM Users u JOIN Roles r ON u.RoleId = r.RoleId WHERE u.UserId = ?', [decoded.id]);

            if (rows.length === 0) {
                res.status(401);
                throw new Error('Không tìm thấy người dùng');
            }
            req.user = rows[0];

            next(); // Chuyển sang middleware/controller tiếp theo
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Không được phép, token không hợp lệ');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Không được phép, không có token');
    }
});

// Middleware: Kiểm tra vai trò của người dùng
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.RoleName)) {
            res.status(403); // 403 Forbidden
            throw new Error(`Vai trò '${req.user.RoleName}' không có quyền truy cập vào tài nguyên này`);
        }
        next();
    };
};

module.exports = {
    protect,
    authorize
};
