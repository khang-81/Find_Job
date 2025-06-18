import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const StudentRegisterForm = () => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword){
            setError("Mật khẩu không khớp!");
            return;
        }
        try {
            await api.post('/auth/register/student', formData);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) { setError(err.response?.data?.message || 'Lỗi đăng ký'); }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Đăng ký cho Sinh viên</h3>
            <input name="fullName" onChange={handleChange} placeholder="Họ và Tên" required />
            <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" onChange={handleChange} placeholder="Mật khẩu" required />
            <input type="password" name="confirmPassword" onChange={handleChange} placeholder="Xác nhận Mật khẩu" required />
            <input name="schoolName" onChange={handleChange} placeholder="Tên trường học" />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Đăng ký</button>
        </form>
    );
};

const EmployerRegisterForm = () => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword){
            setError("Mật khẩu không khớp!");
            return;
        }
        try {
            await api.post('/auth/register/employer', formData);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) { setError(err.response?.data?.message || 'Lỗi đăng ký'); }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h3>Đăng ký cho Nhà Tuyển Dụng</h3>
            <input name="fullName" onChange={handleChange} placeholder="Tên người liên hệ" required />
            <input type="email" name="email" onChange={handleChange} placeholder="Email công ty" required />
            <input type="password" name="password" onChange={handleChange} placeholder="Mật khẩu" required />
            <input type="password" name="confirmPassword" onChange={handleChange} placeholder="Xác nhận Mật khẩu" required />
            <input name="companyName" onChange={handleChange} placeholder="Tên công ty / tổ chức" required />
            <input name="address" onChange={handleChange} placeholder="Địa chỉ" required />
            <input name="website" onChange={handleChange} placeholder="Website (tùy chọn)" />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Đăng ký</button>
        </form>
    );
};

const RegisterPage = () => {
    const [userType, setUserType] = useState('student');
    return (
        <div>
            <div className="tabs">
                <button className={`tab ${userType === 'student' ? 'active' : ''}`} onClick={() => setUserType('student')}>Tôi là Sinh viên</button>
                <button className={`tab ${userType === 'employer' ? 'active' : ''}`} onClick={() => setUserType('employer')}>Tôi là Nhà tuyển dụng</button>
            </div>
            {userType === 'student' ? <StudentRegisterForm /> : <EmployerRegisterForm />}
        </div>
    );
};

export default RegisterPage;