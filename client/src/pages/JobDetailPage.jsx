import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';

const JobDetailPage = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        try {
            await api.post(`/jobs/${id}/apply`);
            alert('Ứng tuyển thành công!');
        } catch(err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!job) return <p>Không tìm thấy tin tuyển dụng.</p>;

    return (
        <div className="card">
            <h1>{job.Title}</h1>
            <p><strong>Công ty:</strong> {job.CompanyName}</p>
            <p><strong>Địa chỉ:</strong> {job.CompanyAddress}</p>
            <p><strong>Lương:</strong> {job.SalaryDescription}</p>
            <p><strong>Loại hình:</strong> {job.JobType}</p>
            <h3>Mô tả công việc</h3>
            <p style={{whiteSpace: 'pre-wrap'}}>{job.Description}</p>
            <h3>Yêu cầu</h3>
            <p style={{whiteSpace: 'pre-wrap'}}>{job.Requirements}</p>
            {isAuthenticated && user.role === 'Student' && (
                <button onClick={handleApply}>Ứng tuyển ngay</button>
            )}
            {!isAuthenticated && (
                 <p>Vui lòng <Link to="/login">đăng nhập</Link> với vai trò sinh viên để ứng tuyển.</p>
            )}
        </div>
    );
};
export default JobDetailPage;
