const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({
        id,
        role
    }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token sẽ hết hạn sau 30 ngày
    });
};

module.exports = generateToken;