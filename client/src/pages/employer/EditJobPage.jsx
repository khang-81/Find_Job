import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

const EditJobPage = () => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { jobId } = useParams();

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const { data } = await api.get(`/jobs/${jobId}`);
                setFormData(data);
            } catch (err) {
                console.error("Error fetching job data:", err);  // Log lỗi nếu có
                setError("Không thể tải dữ liệu tin đăng.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobData();
    }, [jobId]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckboxChange = e => setFormData({ ...formData, [e.target.name]: e.target.checked });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/jobs/${jobId}`, formData);
            alert('Cập nhật tin thành công!');
            navigate('/employer/dashboard');
        } catch (err) {
            console.error("Error updating job:", err);  // Log lỗi nếu có
            setError(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };
    
    if (loading) return <p>Đang tải...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Chỉnh sửa tin tuyển dụng</h2>
            <label>Tiêu đề</label>
            <input name="title" value={formData.Title || ''} onChange={handleChange} required />
            <label>Mô tả</label>
            <textarea name="description" rows="5" value={formData.Description || ''} onChange={handleChange} required></textarea>
            <label>Yêu cầu</label>
            <textarea name="requirements" rows="5" value={formData.Requirements || ''} onChange={handleChange} required></textarea>
            <label>Lương</label>
            <input name="salaryDescription" value={formData.SalaryDescription || ''} onChange={handleChange} required />
            <label>Loại hình công việc</label>
            <select name="jobType" onChange={handleChange} value={formData.JobType || 'PartTime'}>
                <option value="PartTime">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Thực tập</option>
            </select>
            <label>Địa chỉ</label>
            <input name="addressDetail" value={formData.AddressDetail || ''} onChange={handleChange} />
            <div><input type="checkbox" name="isRemote" id="isRemote" checked={formData.IsRemote || false} onChange={handleCheckboxChange} /> <label htmlFor="isRemote">Làm việc từ xa</label></div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <button type="submit">Lưu thay đổi</button>
        </form>
    );
};

export default EditJobPage;
