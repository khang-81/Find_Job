import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const PostJobPage = () => {
    const [formData, setFormData] = useState({ jobType: 'PartTime', isRemote: false });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckboxChange = e => setFormData({ ...formData, [e.target.name]: e.target.checked });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', formData);
            alert('Đăng tin thành công! Tin của bạn đang chờ duyệt.');
            navigate('/employer/dashboard');
        } catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra.'); }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Đăng tin tuyển dụng mới</h2>
            <input name="title" onChange={handleChange} placeholder="Tiêu đề công việc" required />
            <textarea name="description" rows="5" onChange={handleChange} placeholder="Mô tả chi tiết công việc" required></textarea>
            <textarea name="requirements" rows="5" onChange={handleChange} placeholder="Yêu cầu đối với ứng viên" required></textarea>
            <input name="salaryDescription" onChange={handleChange} placeholder="Mô tả lương (VD: 20-25k/giờ, Thỏa thuận)" required />
            <select name="jobType" onChange={handleChange} value={formData.jobType}>
                <option value="PartTime">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Thực tập</option>
            </select>
            <input name="addressDetail" onChange={handleChange} placeholder="Địa chỉ làm việc chi tiết" />
            <div><input type="checkbox" name="isRemote" id="isRemote" checked={formData.isRemote || false} onChange={handleCheckboxChange} /> <label htmlFor="isRemote">Làm việc từ xa</label></div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <button type="submit">Đăng tin</button>
        </form>
    );
};
export default PostJobPage;
