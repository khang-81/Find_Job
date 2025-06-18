const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // Đôi khi lỗi có status 200, ta sẽ đổi thành 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Chỉ hiển thị stack trace khi đang ở môi trường development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
